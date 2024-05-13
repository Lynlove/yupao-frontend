import {getCurrentUserState} from "../states/user.ts";
import myAxios from "../plugins/myAxios.ts";

/**
 * 获取用户信息
 */
export const getCurrentUser = async () => {
    const user = getCurrentUserState();
    if (user) {
        return user;
    }
    const res = await myAxios.get('/user/current');
    if (res.code === 0){
        return res.data;
    }
    return null;
}