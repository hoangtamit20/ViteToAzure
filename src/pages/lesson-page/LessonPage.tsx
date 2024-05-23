import { Box, Typography } from "@mui/material";
import styles from "./LessonPage.module.scss";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { httpClient } from "../../utils/AxiosHttpClient";
import CircleLoading from "../../components/CircleLoading/CircleLoading";
import { sleep } from "../../utils/sleep";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import dashjs from "dashjs";

const LessonPage = () => {
    const { courseId } = useParams();
    const videoRef = useRef<null | HTMLVideoElement>(null);

    const [selectedLessonId, setSeletedLessionId] = useState(null);
    const [lessonDetail, setLessonDetail] = useState(null);

    const getCourseLessons = async () => {
        if (courseId) {
            // await sleep(1231231231231);
            const response = await httpClient.post(
                "/api/v1/lessons/lessonsofcourse",
                {
                    courseId,
                }
            );

            if (response?.data.data.length > 0) {
                setSeletedLessionId(response?.data.data[0]?.id);
            }

            return response;
        }
    };

    async function getLessonDetail(lessonId: string | number) {
        if (lessonId) {
            const response = await httpClient.get(
                `/api/v1/lessons/${lessonId}`
            );

            return response;
        }
    }

    const { data: courseLessons, isLoading } = useQuery({
        queryKey: [`courseLessons/${courseId}`],
        queryFn: getCourseLessons,
    });

    const { data, mutateAsync: getLessonDetailAsync } = useMutation({
        mutationFn: getLessonDetail,
    });

    async function onLessonClick(item) {
        if (item.id != null && item.id !== selectedLessonId) {
            setSeletedLessionId(item.id);
        }
    }

    let selectedLesson: any = null;

    if (selectedLessonId != null && courseLessons?.data.data.length > 0) {
        selectedLesson = courseLessons?.data.data.find(
            (item) => item.id === selectedLessonId
        );
    }

    useEffect(() => {
        let player: dashjs.MediaPlayerClass | null = null;
        let tracks: HTMLTrackElement[] = [];

        if (selectedLesson && videoRef.current != null) {
            fetchAndRenderLessonVideo();

            async function fetchAndRenderLessonVideo() {
                const response = await getLessonDetailAsync(selectedLesson.id);
                console.log("response:", response);

                const lessonDetail = response?.data?.data;
                if (lessonDetail) {
                    setLessonDetail(lessonDetail);

                    const protData = {
                        "com.microsoft.playready": {
                            serverURL:
                                lessonDetail.lessonStreamingProperty
                                    .playReadyUrlLicenseServer,
                            httpRequestHeaders: {
                                Authorization:
                                    lessonDetail.lessonStreamingProperty.token,
                            },
                            withCredentials: false,
                        },
                        "com.widevine.alpha": {
                            serverURL:
                                lessonDetail.lessonStreamingProperty
                                    .widevineUrlLicenseServer,
                            httpRequestHeaders: {
                                Authorization:
                                    lessonDetail.lessonStreamingProperty.token,
                            },
                            withCredentials: false,
                        },
                    };
                    player = dashjs.MediaPlayer().create();
                    player.initialize(videoRef.current!, undefined, false);
                    player.setProtectionData(protData);
                    player.attachSource(
                        lessonDetail.lessonStreamingProperty.urlStreamDashCsf
                    );

                    for (const [
                        index,
                        subtitleInfo,
                    ] of lessonDetail.lessonSubtitleProperties.entries()) {
                        try {
                            const response = await httpClient.get(
                                subtitleInfo.subtitleUrl,
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
                                track.srclang =
                                    src.trim() || subtitleInfo.language;
                                track.label =
                                    label.trim() || subtitleInfo.language;
                                videoRef.current.append(track);

                                if (index === 0) {
                                    videoRef.current.textTracks[index].mode =
                                        "showing";
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
        }

        return () => {
            if (player) {
                player.destroy();
            }

            if (tracks.length > 0) {
                for (const track of tracks) {
                    track.remove();
                }
                tracks = [];
            }
        };
    }, [selectedLessonId, selectedLesson?.id]);

    console.log("courseLessons:", courseLessons);
    console.log("selectedLesson:", selectedLesson);

    return (
        <Box className={styles.containerLesson}>
            <Box className={styles.wrapper}>
                {isLoading ? (
                    <Box className={styles.loadingBox}>
                        <CircleLoading />
                    </Box>
                ) : courseLessons?.data.data.length > 0 ? (
                    <>
                        <h3 style={{ paddingRight: "5px" }}>
                            <span>
                                Course Lesson <DoubleArrowIcon />{" "}
                                {selectedLesson ? selectedLesson.name : ""}
                            </span>
                        </h3>
                        <Box
                            className={`${styles.contentBox} ${styles.videoBox}`}
                        >
                            <video
                                ref={videoRef}
                                controls
                                className={styles.video}
                            ></video>
                        </Box>
                        {courseLessons?.data.data.map((item, i) => {
                            return (
                                <Fragment key={item.id}>
                                    <Box className={styles.lessonContent}>
                                        <Box
                                            className={
                                                styles.backgroundThumbnailBox //
                                            }
                                        ></Box>
                                        <Typography
                                            onClick={() => onLessonClick(item)}
                                            className={`${
                                                styles.specificLesson
                                            } ${
                                                item.id === selectedLessonId
                                                    ? styles.selectedLesson
                                                    : ""
                                            }`}
                                        >
                                            Lesson {i + 1}: {item.name}
                                        </Typography>
                                    </Box>
                                </Fragment>
                            );
                        })}
                    </>
                ) : (
                    <Box className={styles.loadingBox}>
                        No lesson available for this course
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default LessonPage;
