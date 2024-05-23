import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { httpClient } from "../../../utils/AxiosHttpClient";
import AllCourseFillterArea from "../AllCourseFillterArea/AllCourseFillterArea";
import CourseContent from "./CourseContent/CourseContent";
import styles from "./MainContent.module.scss";
import queryString from "query-string";
import { Virtual } from "swiper/modules";
console.log("styles:", styles);
export interface GetAllCourseApiParams {
    Query: string;
    "CourseFilterProperties.IsFree"?: boolean;
    "CourseFilterProperties.FromPrice"?: number;
    "CourseFilterProperties.ToPrice"?: number;
    "CourseFilterProperties.CourseTopicIds"?: string[];
}

export interface GetAllCourseFilterForm {
    fromPrice: string;
    toPrice: string;
    isFree: boolean;
    query: string;
    selectedTopic: string[];
}

const MainContent = () => {
    const [getAllCourseFilterForm, setGetAllCourseFilterForm] =
        useState<GetAllCourseFilterForm>({
            fromPrice: "",
            toPrice: "",
            isFree: false,
            query: "",
            selectedTopic: [],
        });

    console.log("getAllCourseFilterForm:", getAllCourseFilterForm);

    const onGetAllCourseFilterParamsChange = (name, value) => {
        setGetAllCourseFilterForm((currentState) => ({
            ...currentState,
            [name]: value,
        }));
    };

    const getAllCourse = async ({ queryKey }) => {
        const finalizedParams = {} as GetAllCourseApiParams;
        const [, params] = queryKey as [string, GetAllCourseFilterForm];

        const query = params.query.trim();
        if (query !== "") {
            finalizedParams["Query"] = params.query.trim();
        }

        const trimmedFromPrice = params.fromPrice.trim();
        const fromPriceConvertedToNumber = Number(trimmedFromPrice);
        if (
            trimmedFromPrice !== "" &&
            !Number.isNaN(fromPriceConvertedToNumber)
        ) {
            finalizedParams["CourseFilterProperties.FromPrice"] =
                fromPriceConvertedToNumber;
        }

        const trimmedToPrice = params.toPrice.trim();
        const toPriceConvertedToNumber = Number(trimmedToPrice);
        if (trimmedToPrice !== "" && !Number.isNaN(toPriceConvertedToNumber)) {
            finalizedParams["CourseFilterProperties.ToPrice"] =
                toPriceConvertedToNumber;
        }

        if (params.isFree === true) {
            finalizedParams["CourseFilterProperties.IsFree"] = params.isFree;
        }

        if (params.selectedTopic.length > 0) {
            finalizedParams["CourseFilterProperties.CourseTopicIds"] =
                params.selectedTopic;
        }

        const paramsString = queryString.stringify(finalizedParams);
        const reponse = await httpClient.get(
            `/api/v1/course/get-alls?${paramsString}`
        );
        return reponse.data;
    };

    const getRecommendCourse = async () => {
        const reponse = await httpClient.get(
            `/api/v1/course/get-courses-recommend`
        );
        return reponse.data;
    };

    const { data: allCourse } = useQuery({
        queryKey: ["all-course", getAllCourseFilterForm],
        queryFn: getAllCourse,
    });

    const { data: recommendCourse } = useQuery({
        queryKey: ["recommend-course"],
        queryFn: getRecommendCourse,
    });

    return (
        <>
            <Box>
                <Box className={styles.allCourse}>
                    <Box className={styles.courseContainer}>
                        <h2 className={styles.title}>Filter Area</h2>
                        <Box>
                            <AllCourseFillterArea
                                getAllCourseFilterForm={getAllCourseFilterForm}
                                onGetAllCourseFilterParamsChange={
                                    onGetAllCourseFilterParamsChange
                                }
                            />
                        </Box>
                        <h2 className={styles.title}>All Courses</h2>

                        <div className={styles.courseWrapper}>
                            {allCourse?.data.items.length === 0 ? (
                                <Typography
                                    className={
                                        styles.noCourseAvailableContainer
                                    }
                                >
                                    No course available
                                </Typography>
                            ) : allCourse?.data.items.length < 4 ? (
                                <Box
                                    className={
                                        styles.courseWrapperWhenLessThan4
                                    }
                                >
                                    {allCourse?.data.items.map((item, i) => (
                                        <Box className={styles.courseContent}>
                                            <CourseContent
                                                course={item}
                                                key={item.id}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Swiper
                                    slidesPerView={4}
                                    onSlideChange={() =>
                                        console.log("slide change")
                                    }
                                    onSwiper={(swiper) => console.log(swiper)}
                                    virtual
                                    modules={[Virtual]}
                                    className={styles.swiperContainer}
                                >
                                    {allCourse?.data.items
                                        // .concat(allCourse?.data.items)
                                        // .concat(allCourse?.data.items)
                                        // .concat(allCourse?.data.items)
                                        .map((item, i) => (
                                            <SwiperSlide virtualIndex={i}>
                                                <CourseContent
                                                    course={item}
                                                    key={item.id}
                                                />
                                            </SwiperSlide>
                                        ))}
                                </Swiper>
                            )}
                        </div>
                    </Box>

                    <Box className={styles.courseContainer}>
                        <h2 className={styles.title}>Recommended Courses</h2>

                        <div className={styles.courseWrapper}>
                            {recommendCourse?.length < 4 ? (
                                <Box
                                    className={
                                        styles.courseWrapperWhenLessThan4
                                    }
                                >
                                    {recommendCourse
                                        ?.concat(recommendCourse)
                                        .map((item, i) => (
                                            <Box
                                                className={styles.courseContent}
                                            >
                                                <CourseContent
                                                    course={item}
                                                    key={item.id}
                                                />
                                            </Box>
                                        ))}
                                </Box>
                            ) : (
                                <Swiper
                                    slidesPerView={4}
                                    onSlideChange={() =>
                                        console.log("slide change")
                                    }
                                    onSwiper={(swiper) => console.log(swiper)}
                                    virtual
                                    modules={[Virtual]}
                                    className={styles.swiperContainer}
                                >
                                    {recommendCourse
                                        ?.concat(recommendCourse)
                                        .concat(recommendCourse)
                                        .concat(recommendCourse)
                                        .map((item, i) => (
                                            <SwiperSlide virtualIndex={i}>
                                                <CourseContent
                                                    course={item}
                                                    key={item.id}
                                                />
                                            </SwiperSlide>
                                        ))}
                                </Swiper>
                            )}
                        </div>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default MainContent;
