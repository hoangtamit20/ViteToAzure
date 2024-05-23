export const sleep = async (timeInSecond: number) => {
    return new Promise((res) => setTimeout(res, timeInSecond * 1000));
};
