import { Avatar, Box } from "@mui/material";
import styles from "./Story.module.scss";
import { FaQuoteLeft } from "react-icons/fa";

const Story = () => {
    return (
        <Box className={styles.container}>
            <Box className={styles.wrapper}>
                <Box className={styles.title}>
                    <Box style={{ textAlign: "left" }}>
                        <FaQuoteLeft className={styles.quote} />
                    </Box>
                    <p>
                        Thanks to Udemy Business, Booz Allen has armed our
                        workforce, specifically its{" "}
                        <strong>
                            data scientists, with highly relevant and in-demand
                            tech skill
                        </strong>
                        s that are enabling consultants to stay ahead of big
                        data trends and raise the bar on proficiency, skills,
                        and competencies to meet client demand.
                    </p>
                    <a href="https://business.udemy.com/case-studies/booz-allen/?_sft_resource_type=case-study&ref=ub-home-customerstories--variant-101486&utm_source=direct&utm_medium=direct&utm_type=mx">
                        Read full story
                    </a>
                </Box>
                <Box className={styles.subtitle}>
                    <Avatar
                        className={styles.avatar}
                        alt="Remy Sharp"
                        src="https://s.udemycdn.com/home/ub-case-studies/James_Hemgen.jpeg"
                        sx={{ width: 100, height: 100 }}
                    />
                    <h1>Jim Hemgen</h1>
                    <p className={styles.caption}>Principal</p>
                    <p>Booz Allen Hamilton</p>
                </Box>
            </Box>
        </Box>
    );
};

export default Story;
