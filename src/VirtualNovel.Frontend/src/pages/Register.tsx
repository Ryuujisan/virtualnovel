import TitledBox from "../shared/components/TitledBox.tsx";
import {Button, Divider, InputAdornment, Stack, TextField} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';

import {useState} from "react";
import {registerWithEmail, signInWithGoogle} from "../shared/auth/auth.service.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useUserStore} from "../store/userStore.ts";

type RegisterErrors = {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<RegisterErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const setUser = useUserStore(x => x.setUser);

    const navigate = useNavigate();
    function validate(): boolean {
        const nextErrors: RegisterErrors = {};

        const normalizedEmail = formData.email.trim();

        if (!normalizedEmail) {
            nextErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!formData.password) {
            nextErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            nextErrors.password = "Password must contain at least 6 characters.";
        }

        if (!formData.confirmPassword) {
            nextErrors.confirmPassword = "Repeat the password.";
        } else if (formData.password !== formData.confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    function onSubmit() {
        if(validate()) {
            void register();
        }
    }
    async function register() {

        setIsLoading(true);
        try {
            const user = await registerWithEmail(formData.email, formData.password);
            toast.success("Register successfully.");
            setUser(user.profile)
            navigate(`/profile/${user.profile.firebaseUid}`)

        } catch (e) {
            console.error(e);
            toast.error("Register failed.");
        }
        finally {
            setIsLoading(false);
        }
    }
    async function registerWithGoogle() {
        const user = await signInWithGoogle()
        setUser(user.profile)
        navigate(`/profile/${user.profile.firebaseUid}`)
    }
    return (

        <TitledBox
            sx={{
                width: {
                    xs: "100%",
                    sm: "70%",
                    md: "45%",
                    lg: "30%",
                },
                mx: "auto",
            }}
            title="Register"
        >
            <Stack spacing={2}
                   component="form"
                   onSubmit={onSubmit}
                   sx={{mx: "auto"}}>
            <TextField
                id={`email-input`}
                label="Email"
                type="email"
                disabled={isLoading}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    },
                }}
            />
                <TextField
                    id={`password-input`}
                    label="Password"
                    type="password"
                    disabled={isLoading}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    required
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <TextField
                    id={`ConfirmPassword-input`}
                    label="Confirm Password"
                    type="password"
                    disabled={isLoading}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                    required
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <Button variant={"contained"}
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            if(validate()) {
                                console.log("CLick register")
                                void register();
                            }
                        }}
                >Register</Button>
                <Divider sx={{ my: 2 }}>
                    OR
                </Divider>
                <Button variant={"outlined"} startIcon={<GoogleIcon />} onClick={async (e) => {
                    e.preventDefault();
                    void registerWithGoogle();
                }}>Register via Google</Button>

            </Stack>
        </TitledBox>

    )
}
