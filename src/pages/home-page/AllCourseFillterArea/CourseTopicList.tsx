import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
];

export interface IAllTopic {
    name: string;
    id: number;
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function CourseTopicList({
    allCourseTopic,
    onGetAllCourseFilterParamsChange,
}: {
    allCourseTopic: IAllTopic[];
    onGetAllCourseFilterParamsChange: Function;
}) {
    const theme = useTheme();
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        console.log("value:", value);
        const finalValue = typeof value === "string" ? value.split(",") : value;
        setPersonName(finalValue);
        const selectedTopic = finalValue.map((item) => Number(item));
        onGetAllCourseFilterParamsChange("selectedTopic", selectedTopic);
    };

    return (
        <FormControl sx={{ width: 300, marginTop: "15px" }}>
            <Select
                multiple
                displayEmpty
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <em>Select Course Topic</em>;
                    }
                    const renderedValue = selected.map(
                        (item) =>
                            allCourseTopic.find(
                                (topic) => topic.id === Number(item)
                            ).name
                    );
                    return renderedValue.join(", ");
                }}
                MenuProps={MenuProps}
                inputProps={{ "aria-label": "Without label" }}
            >
                <MenuItem disabled value="">
                    <em>Select Course Topic</em>
                </MenuItem>
                {allCourseTopic?.map((topic) => (
                    <MenuItem
                        key={topic.id}
                        value={topic.id}
                        style={getStyles(topic.name, personName, theme)}
                    >
                        {topic.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
