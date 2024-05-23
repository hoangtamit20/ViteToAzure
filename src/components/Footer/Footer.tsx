import { Box, List, ListItem } from "@mui/material";
import styles from "./Footer.module.scss";
import LanguageIcon from "@mui/icons-material/Language";

const Footer = () => {
    return (
        <Box className={styles.container}>
            <Box className={styles.wrapper}>
                <List className={styles.list}>
                    <ListItem>
                        <a href="/udemy-business/?locale=en_US&mx_pg=home-page&path=%2F&ref=footer">
                            Udemy Business
                        </a>
                    </ListItem>
                    <ListItem>
                        <a href="/teaching/?ref=teach_footer">Teach on Udemy</a>
                    </ListItem>
                    <ListItem>
                        <a href="/mobile/">Get the app</a>
                    </ListItem>
                    <ListItem>
                        <a href="https://about.udemy.com/?locale=en-us">
                            About us
                        </a>
                    </ListItem>
                    <ListItem>
                        <a href="https://about.udemy.com/company?locale=en-us#offices">
                            Contact us
                        </a>
                    </ListItem>
                </List>
                <List className={styles.list}>
                    <ListItem>
                        <a href="https://about.udemy.com/careers?locale=en-us">
                            Careers
                        </a>
                    </ListItem>
                    <ListItem>
                        <a href="https://blog.udemy.com/?ref=footer">Blog</a>
                    </ListItem>
                    <ListItem>
                        <a href="/support/">Help and Support</a>
                    </ListItem>
                    <ListItem>
                        <a href="/affiliate/">Affiliate</a>
                    </ListItem>
                    <ListItem>
                        <a href="https://investors.udemy.com">Investors</a>
                    </ListItem>
                </List>
                <List className={styles.list}>
                    <ListItem>
                        <a href="/terms/">Terms</a>
                    </ListItem>
                    <ListItem>
                        <a href="/terms/privacy/">Privacy policy</a>
                    </ListItem>
                    <ListItem>
                        <a href="#">Cookie settings</a>
                    </ListItem>
                    <ListItem>
                        <a href="/sitemap/">Sitemap</a>
                    </ListItem>
                    <ListItem>
                        <a href="https://about.udemy.com/accessibility-statement?locale=en-us">
                            Accessibility statement
                        </a>
                    </ListItem>
                </List>
                <Box className={styles.sourceLink}>
                    <span className={styles.wrapperSourceLink}>
                        <LanguageIcon className={styles.iconLanguage} />
                        <a href="#">English</a>
                    </span>
                </Box>
            </Box>
            <Box className={styles.logo}>
                <a href="#">
                    <img
                        src="	https://www.udemy.com/staticx/udemy/images/v7/logo-udemy-inverted.svg"
                        alt="illustration logo"
                    />
                </a>
            </Box>
        </Box>
    );
};

export default Footer;
