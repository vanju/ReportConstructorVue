export default {
    install: (app, options) => {

        app.config.globalProperties.$fetch = async function (url, params) {

            params = params ?? {};
            params.headers = {
                'Content-Type': 'application/json'
            };

            if (options.mode == 'dev') {
                if (params.mock) {
                    return await mockFetch(url, params);
                } else {
                    return await appFetch(options.host + url, params);
                }
            } else if (options.mode == 'prod') {
                return await appFetch(url, params);
            }
        };

        async function appFetch(url, options) {
            
            const response = await fetch(url, options);
            const json = await response.json();
            return json;
        }

        async function mockFetch(url, options) {

            let model = DB[url];

            return {
                success: true,
                data: {
                    model: model
                }
            };
        }

        let DB = {};

        app.provide('RCCorePlugin', options);
    }
};
