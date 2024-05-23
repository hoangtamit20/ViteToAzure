import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
    RawAxiosRequestConfig,
} from "axios";

type HttpClientRawAxiosRequestConfig<TBody = any> =
    RawAxiosRequestConfig<TBody> & {
        // cacheInServer: boolean; // not available yet
        isDisplayFullScreenLoading?: boolean;
        includeAccessToken?: boolean;
    };

type HttpClientInternalAxiosRequestConfig = InternalAxiosRequestConfig & {
    // cacheInServer: boolean; // not available yet
    isDisplayFullScreenLoading?: boolean;
    includeAccessToken?: boolean;
};

const setupConfigForHttpInstance = (instance: AxiosInstance) => {
    // Now all requests using this instance will wait 10 seconds before timing out
    // instance.defaults.timeout =
    //     EnvVars.NEXT_PUBLIC_API_TIMEOUT_IN_SECOND * 1000;
    // instance.defaults.withCredentials = true;

    instance.interceptors.request.use(
        function (config: HttpClientInternalAxiosRequestConfig) {
            if (
                typeof config.includeAccessToken !== "boolean" ||
                config.includeAccessToken === true
            ) {
                // Do something before request is sent
                const accessToken = localStorage.getItem("accessToken");
                console.log("accessToken here:", accessToken);
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        function (error: unknown) {
            // console.log('error Config request:', error);

            // Do something with request error

            return Promise.reject(error);
        },
        { synchronous: true }
    );

    instance.interceptors.response.use(
        async function (response) {
            // Do something before request is sent
            // console.log('response:', response);

            return response;
        },
        async function (error) {
            // Do something with request error
            // console.log('error response:', error);

            return Promise.reject(error);
            throw error;
        }
    );
};

export class AxiosHttpClient {
    private readonly httpInstance: AxiosInstance;

    constructor(
        httpInstance: AxiosInstance,
        setupConfigForHttpInstance: (axiosInstance: AxiosInstance) => void
    ) {
        this.httpInstance = httpInstance;
        setupConfigForHttpInstance(this.httpInstance);
    }

    get<TResponseData = any, TBody = any, R = AxiosResponse<TResponseData>>(
        routePathEndpoint: string,
        overridableOptions?: HttpClientRawAxiosRequestConfig<TBody>
    ) {
        return this.httpInstance.get<TResponseData, R, TBody>(
            routePathEndpoint,
            {
                ...overridableOptions,
            } as HttpClientRawAxiosRequestConfig<TBody>
        );
    }

    post<TResponseData = any, TBody = any, R = AxiosResponse<TResponseData>>(
        routePathEndpoint: string,
        body: TBody,
        overridableOptions?: HttpClientRawAxiosRequestConfig<TBody>
    ) {
        return this.httpInstance.post<TResponseData, R, TBody>(
            routePathEndpoint,
            body,
            {
                ...overridableOptions,
            } as HttpClientRawAxiosRequestConfig<TBody>
        );
    }

    put<TResponseData = any, TBody = any, R = AxiosResponse<TResponseData>>(
        routePathEndpoint: string,
        body: TBody,
        overridableOptions?: HttpClientRawAxiosRequestConfig<TBody>
    ) {
        return this.httpInstance.put<TResponseData, R, TBody>(
            routePathEndpoint,
            body,
            {
                ...overridableOptions,
            } as HttpClientRawAxiosRequestConfig<TBody>
        );
    }

    patch<TResponseData = any, TBody = any, R = AxiosResponse<TResponseData>>(
        routePathEndpoint: string,
        body: TBody,
        overridableOptions?: HttpClientRawAxiosRequestConfig<TBody>
    ) {
        return this.httpInstance.patch<TResponseData, R, TBody>(
            routePathEndpoint,
            body,
            {
                ...overridableOptions,
            } as HttpClientRawAxiosRequestConfig<TBody>
        );
    }

    delete<TResponseData = any, TBody = any, R = AxiosResponse<TResponseData>>(
        routePathEndpoint: string,
        overridableOptions?: HttpClientRawAxiosRequestConfig<TBody>
    ) {
        return this.httpInstance.delete<TResponseData, R, TBody>(
            routePathEndpoint,
            {
                ...overridableOptions,
            } as HttpClientRawAxiosRequestConfig<TBody>
        );
    }
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

export const httpClient = new AxiosHttpClient(
    axiosInstance,
    setupConfigForHttpInstance
);
