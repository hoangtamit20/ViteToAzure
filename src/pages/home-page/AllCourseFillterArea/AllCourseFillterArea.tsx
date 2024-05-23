import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useQuery } from "@tanstack/react-query";
import { FormGroup } from "react-bootstrap";
import { httpClient } from "../../../utils/AxiosHttpClient";
import { GetAllCourseFilterForm } from "../MainContent/MainContent";
import styles from "./AllCourseFillterArea.module.scss";
import CheckboxList, { IAllTopic } from "./CourseTopicList";

interface AllCourseFillterAreaProps {
    onGetAllCourseFilterParamsChange: (
        name: string,
        value: string | boolean
    ) => void;
    getAllCourseFilterForm: GetAllCourseFilterForm;
}

const AllCourseFillterArea = ({
    onGetAllCourseFilterParamsChange,
    getAllCourseFilterForm,
}: AllCourseFillterAreaProps) => {
    const getAllTopic = async () => {
        const reponse = await httpClient.get(`api/v1/coursetopic/getalls`);
        return reponse.data;
    };

    const { data } = useQuery({
        queryKey: ["all-topic"],
        queryFn: getAllTopic,
    });

    const allCourseTopic: IAllTopic[] = data?.data.items;

    return (
        <Box className={styles.container}>
            <Box className={styles.wrapper}>
                <Box className={styles.title}>Search</Box>
                <Box className={styles.searchBox}>
                    <TextField
                        id="outlined-basic"
                        label="Course name"
                        variant="outlined"
                        value={getAllCourseFilterForm.query}
                        onChange={(e) => {
                            onGetAllCourseFilterParamsChange(
                                "query",
                                e.target.value
                            );
                        }}
                    />
                    <TextField
                        id="outlined-basic"
                        label="From price"
                        variant="outlined"
                        value={getAllCourseFilterForm.fromPrice}
                        onChange={(e) => {
                            onGetAllCourseFilterParamsChange(
                                "fromPrice",
                                e.target.value
                            );
                        }}
                        type={"number"}
                    />
                    <TextField
                        id="outlined-basic"
                        label="To price"
                        variant="outlined"
                        value={getAllCourseFilterForm.toPrice}
                        onChange={(e) => {
                            onGetAllCourseFilterParamsChange(
                                "toPrice",
                                e.target.value
                            );
                        }}
                        type={"number"}
                    />
                </Box>
            </Box>
            <Box className={styles.wrapper}>
                <Box>Course Topic</Box>
                <Box>
                    <CheckboxList
                        onGetAllCourseFilterParamsChange={
                            onGetAllCourseFilterParamsChange
                        }
                        allCourseTopic={allCourseTopic}
                    />
                </Box>
            </Box>
            <Box className={styles.wrapper}>
                <Box>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    sx={{
                                        color: pink[800],
                                        "&.Mui-checked": {
                                            color: pink[600],
                                        },
                                    }}
                                    checked={getAllCourseFilterForm.isFree}
                                    onChange={(e) => {
                                        onGetAllCourseFilterParamsChange(
                                            "isFree",
                                            e.target.checked
                                        );
                                    }}
                                />
                            }
                            label="Free Course"
                        />
                    </FormGroup>
                </Box>
            </Box>
        </Box>
    );
};

export default AllCourseFillterArea;
