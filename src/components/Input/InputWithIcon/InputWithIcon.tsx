import React, { ReactElement } from "react";
import { Container, Form, FormControlProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";
import styles from "./InputWithIcon.module.scss";

type Props = React.PropsWithChildren<
    ReplaceProps<"input", BsPrefixProps<"input"> & FormControlProps>
> & {
    icon: ReactElement;
};

const InputWithIcon = ({ icon, className, ...restProps }: Props) => {
    return (
        <Container className={styles.container}>
            <Container className={styles.iconContainer}>{icon}</Container>
            <Form.Control
                {...restProps}
                className={className + " " + styles.input}
            ></Form.Control>
        </Container>
    );
};

export default InputWithIcon;
