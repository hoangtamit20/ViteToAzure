import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { httpClient } from "../../utils/AxiosHttpClient";
import { Box, Typography } from "@mui/material";
import styles from "./CourseDetail.module.scss";
import Footer from "../../components/Footer/Footer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import dashjs from "dashjs";

import CircleLoading from "../../components/CircleLoading/CircleLoading";
import { sleep } from "../../utils/sleep";

type Props = {};

const CourseDetail = (props: Props) => {
    const navigate = useNavigate();
    const params = useParams();
    const videoRef = useRef<null | HTMLVideoElement>(null);
    const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);

    const getCourseDetail = async () => {
        const reponse = await httpClient.get(
            `/api/v1/course/get-course/${params.id}`
        );
        return reponse.data;
    };

    const { data: courseDetail } = useQuery({
        queryKey: [`course-detail/${params.id}`],
        queryFn: getCourseDetail,
    });

    const getCoursePurchaseInfo = async () => {
        const reponse = await httpClient.get(
            `/api/v1/course/checkpurchased/${params.id}`
        );

        // await sleep(5);

        return reponse.data;
    };

    const { data: coursePurchaseInfo, isLoading } = useQuery({
        queryKey: [`checkpurchased/${params.id}`],
        queryFn: getCoursePurchaseInfo,
    });

    async function createOrderAsync(courseId: string | number) {
        const response = await httpClient.post(`/api/v1/orders/create`, {
            courseIds: [Number(courseId)],
        });

        return response.data;
    }

    async function onCoursePurchaseClick() {
        setIsPurchaseInProgress(true);
        try {
            const orderData = await createOrderMutationAsync(params.id!);
            // Navigate to PaymentPage with orderId
            navigate('/payment', { state: { orderId: orderData.data.id } });
        } catch (error) {
            console.error("Error creating order:", error);
            setIsPurchaseInProgress(false);
        }
    }

    const { data: createdOrderInfo, mutateAsync: createOrderMutationAsync } =
        useMutation({
            mutationFn: createOrderAsync,
        });

    useEffect(() => {
        let player: dashjs.MediaPlayerClass | null = null;
        let tracks: HTMLTrackElement[] = [];

        fetchAndRenderCourseVideo();

        async function fetchAndRenderCourseVideo() {
            if (courseDetail && videoRef.current) {
                const protData = {
                    "com.microsoft.playready": {
                        serverURL:
                            courseDetail?.data.courseUrlStreaming
                                .playReadyUrlLicenseServer,
                        httpRequestHeaders: {
                            Authorization:
                                courseDetail?.data.courseUrlStreaming.token,
                        },
                        withCredentials: false,
                    },
                    "com.widevine.alpha": {
                        serverURL:
                            courseDetail?.data.courseUrlStreaming
                                .widevineUrlLicenseServer,
                        httpRequestHeaders: {
                            Authorization:
                                courseDetail?.data.courseUrlStreaming.token,
                        },
                        withCredentials: false,
                    },
                };

                player = dashjs.MediaPlayer().create();
                player.initialize(videoRef.current, undefined, false);
                player.setProtectionData(protData);
                player.attachSource(
                    courseDetail?.data.courseUrlStreaming.urlStreamDashCsf
                );

                for (const [
                    index,
                    subtitleInfo,
                ] of courseDetail?.data.courseSubtitles.entries()) {
                    try {
                        const response = await httpClient.get(
                            subtitleInfo.urlSubtitle,
                            {
                                includeAccessToken: false,
                            }
                        );

                        const subtitleText = response.data;
                        console.log("subtitleText:", subtitleText);

                        const newSrcSubtitle = URL.createObjectURL(
                            new Blob([subtitleText], { type: "text/vtt" })
                        );

                        console.log(newSrcSubtitle);

                        if (videoRef.current != null) {
                            const track = document.createElement("track");
                            const [src, label] =
                                subtitleInfo.language.split("-");
                            track.kind = "subtitles";
                            track.src = newSrcSubtitle;
                            track.srclang = src.trim() || subtitleInfo.language;
                            track.label = label.trim() || subtitleInfo.language;
                            videoRef.current.append(track);

                            if (index === 0) {
                                videoRef.current.textTracks[index].mode =
                                    "showing";
                                // track.default = true;
                            } else {
                                videoRef.current.textTracks[index].mode =
                                    "hidden";
                            }
                            tracks.push(track);
                        }
                    } catch (err) {
                        console.error("Error loading subtitle:", err);
                    }
                }
            }
        }

        return () => {
            if (player != null) {
                player.destroy();
            }

            if (tracks.length > 0) {
                for (const track of tracks) {
                    track.remove();
                }
                tracks = [];
            }
        };
    }, [courseDetail]);

    const formatter = new Intl.NumberFormat("vi-VN", {
        currency: "VND",
    });

    console.log("courseDetail:", courseDetail);
    return (
        <>
            <Box className={styles.courseDetailContainer}>
                <Box className={styles.wrapper}>
                    <Box className={styles.container}>
                        <Box
                            className={`${styles.thumbnailBox} ${styles.leftColumn}`}
                        >
                            {courseDetail && (
                                <img
                                    src={courseDetail?.data.thumbnail}
                                    alt="illustation images"
                                    className={styles.thumbnail}
                                />
                            )}
                            {/* ABC */}
                        </Box>
                        <Box
                            className={`${styles.detailContent} ${styles.rightColumn}`}
                        >
                            {courseDetail && (
                                <>
                                    {console.log(courseDetail.data)
                                    }
                                    <h1>{courseDetail.data.name}</h1>
                                    <p>
                                        {courseDetail.data.description}
                                    </p>
                                    <p className={styles.detailPrice}>
                                        <span>
                                            {formatter.format(
                                                courseDetail.data.price
                                            )}
                                            <span>{" VND"}</span>
                                        </span>
                                    </p>
                                    <Box className={styles.views}>
                                        <p className={styles.titleViews}>
                                            <VisibilityIcon
                                                className={styles.pad_right}
                                            />
                                            {courseDetail.data.weeklyViews}{" "}
                                            (Weekly View)
                                        </p>
                                        <p className={styles.titleViews}>
                                            <VisibilityIcon
                                                className={styles.pad_right}
                                            />
                                            {courseDetail.data.monthlyViews}{" "}
                                            (Monthly View)
                                        </p>
                                        <p className={styles.titleViews}>
                                            <VisibilityIcon
                                                className={styles.pad_right}
                                            />
                                            {courseDetail.data.totalViews}{" "}
                                            (Total Views)
                                        </p>
                                    </Box>
                                    <p>
                                        Created by
                                        <a
                                            style={{
                                                textDecoration: "none",
                                                paddingLeft: "5px",
                                            }}
                                            href="#"
                                        >
                                            {
                                                courseDetail.data.publisher
                                                    .creatorName
                                            }
                                        </a>
                                    </p>
                                    <p>
                                        <LanguageIcon
                                            className={styles.pad_right}
                                        />
                                        English
                                    </p>

                                    {isLoading || isPurchaseInProgress ? (
                                        <Box className={styles.loadingBox}>
                                            <CircleLoading />
                                        </Box>
                                    ) : coursePurchaseInfo?.data
                                        .isCoursePurchased ? (
                                        <Link
                                            className={styles.nextCourse}
                                            to={`/course-detail/${courseDetail?.data.id}/lesson`}
                                        >
                                            Go to course
                                        </Link>
                                    ) : (
                                        <Box>
                                            <Typography
                                                className={styles.nextCourse}
                                                onClick={onCoursePurchaseClick}
                                            // to={`/course-detail/${courseDetail?.data.id}/lesson`}
                                            >
                                                Buy now
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>

                    <Box className={styles.mainBox}>
                        <Box className={styles.titleBox}>
                            <p>Introduction Video</p>
                        </Box>
                        <Box
                            className={`${styles.contentBox} ${styles.videoBox}`}
                        >
                            <video
                                ref={videoRef}
                                controls
                                className={styles.video}
                            ></video>
                        </Box>
                    </Box>

                    <Box className={styles.mainBox}>
                        <Box className={styles.titleBox}>
                            <p>Description</p>
                        </Box>
                        <Box className={styles.contentBox}>
                            <p>
                                <CheckIcon className={styles.pad_right} />
                                The 25+ guidelines of amazing web design: simple
                                rules and guidelines that go straight to the
                                point
                            </p>
                            <p>
                                <CheckIcon className={styles.pad_right} />
                                Immediate FREE access to the course e-book "Best
                                Resources for Web Design and Development with
                                HTML5 & CSS3"
                            </p>
                            <p>
                                <CheckIcon className={styles.pad_right} />
                                How to make text look professionally designed
                            </p>
                            <p>
                                <CheckIcon className={styles.pad_right} />
                                How to correctly use the power of colors
                            </p>
                            <p>
                                <CheckIcon className={styles.pad_right} />
                                How to get and use amazing images, fonts and
                                icons to make your website shine — all for FREE.
                            </p>
                            <p>
                                <CheckIcon className={styles.pad_right} />
                                How to create a layout using whitespace and
                                visual hierarchy
                            </p>
                            <p>
                                <CheckIcon className={styles.pad_right} />
                                How to keep yourself inspired to learn more and
                                more about web design
                            </p>
                            <p>
                                <CheckIcon className={styles.pad_right} />
                                How to make your websites convert better using 8
                                simple-to-use techniques
                            </p>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default CourseDetail;
