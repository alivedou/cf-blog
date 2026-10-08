export async function onRequest(context) {
  const { request, env, next } = context;
  const authHeader = request.headers.get("Authorization");

  // 从后台环境变量读取账号密码，不要硬编码写死在代码里
  const validUser = env.SITE_USER;
  const validPass = env.SITE_PASSWORD;

  // 没配置环境变量时直接放行，防止部署后自己也进不去
  if (!validUser || !validPass) {
    return await next();
  }

  // 【可选】只保护特定路径，比如只锁 /private/ 开头的私密文章
  // 想全站保护就把下面这两行注释掉
  // const url = new URL(request.url);
  // if (!url.pathname.startsWith('/private/')) return await next();

  // 没有密码凭证时，返回401触发浏览器原生密码弹窗
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("需要访问密码", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="站点访问验证"' }
    });
  }

  // 解析并校验密码，用防时序攻击的方式比对更安全
  const base64 = authHeader.split(" ")[1];
  const [user, pass] = atob(base64).split(":");
  const equal = (a, b) => a.length === b.length && [...a].every((c, i) => c === b[i]);

  if (!equal(user, validUser) || !equal(pass, validPass)) {
    return new Response("账号或密码错误", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="站点访问验证"' }
    });
  }

  // 验证通过，正常加载博客页面
  return await next();
}
