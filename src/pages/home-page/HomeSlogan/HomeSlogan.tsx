import { Box } from "@mui/material";
import styles from "./HomeSlogan.module.scss";

const HomeSlogan = () => {
    return (
        <Box className={styles.container}>
            <Box
                style={{ width: "100%", display: "table", overflow: "hidden" }}
            >
                <img
                    className={styles.imgSlogan}
                    src="https://img-c.udemycdn.com/notices/web_carousel_slide/image/4f9d4123-43ee-4f2a-b5ef-1f2ac22962f3.jpg"
                    alt="illustration slogan"
                />
                <Box className={styles.titleWrapper}>
                    <Box className={styles.title}>
                        <h2>New to Udemy?</h2>
                        <h2>Lucky you.</h2>
                        <p>
                            Courses start at ₫299,000. Get your new-student
                            offer <div>before it expires.</div>
                        </p>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default HomeSlogan;
