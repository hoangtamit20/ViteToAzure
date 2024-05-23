import { Box } from "@mui/material";
import Footer from "../../components/Footer/Footer";
import HomeSlogan from "./HomeSlogan/HomeSlogan";
import MainContent from "./MainContent/MainContent";
import Navbar from "../../components/Navbar/Navbar";
import Story from "./Story/Story";
import { useEffect } from "react";
import { httpClient } from "../../utils/AxiosHttpClient";
import RightMenu from "../../components/chat/listusersendmessage";

const HomePage = () => {
    // useEffect(() => {
    //     httpClient.get("/api/v1/course/get-alls").then((res) => {
    //         console.log("response:", res.data);
    //     });
    // }, []);
    return (
        <>
            {/* <Navbar /> */}
            <HomeSlogan />
            <MainContent />
            <RightMenu />
            <Story />
            {/* <Footer /> */}
        </>
    );
};

export default HomePage;
