import { Box, CircularProgress } from "@mui/material";

type Props = {
    color?:
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning"
        | "inherit";
};

const CircleLoading = ({ color }: Props) => {
    return (
        <Box>
            <CircularProgress color={color || "secondary"} />
        </Box>
    );
};

export default CircleLoading;
