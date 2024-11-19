export async function onRequest(context) {
    // 获取請求体中URL的内容，判断是否为圖片或视频，如果是則返回，否則返回錯誤信息
    const {
        request,
        env,
        params,
        waitUntil,
        next,
        data
    } = context;
    //如果是OPTIONS請求，返回允许的方法
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        })
    }
    const jsonRequest = await request.json();
    const url = jsonRequest.url;
    if (url === undefined) {
        return new Response('URL is required', { status: 400 })
    }
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    if (contentType.startsWith('image') || contentType.startsWith('video')) {
        //增加跨域头后返回
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        return new Response(response.body, {
            headers: headers
        })
    } else {
        return new Response('URL is not an image or video', { status: 400 })
    }
}