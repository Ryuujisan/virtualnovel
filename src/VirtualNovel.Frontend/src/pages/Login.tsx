import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {signInWithEmail, signInWithGoogle} from "../shared/auth/auth.service.ts";
import {toast} from "react-toastify";
import {Button, Divider, InputAdornment, Stack, TextField} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import GoogleIcon from "@mui/icons-material/Google";
import TitledBox from "../shared/components/TitledBox.tsx";
import {useUserStore} from "../store/userStore.ts";

type LoginErrors = {
    email?: string;
    password?: string;
}

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<LoginErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const setUser = useUserStore(x => x.setUser);
    const navigate = useNavigate();
    function validate(): boolean {
        const nextErrors: LoginErrors = {};

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

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    function onSubmit() {
        if(validate()) {
            void login();
        }
    }

    async function loginWithGoogle() {
        const user = await signInWithGoogle();
        setUser(user.profile)
        navigate("/")
        navigate(`/profile/${user.profile.firebaseUid}`)
    }

    async function login() {

        setIsLoading(true);
        try {
            const user = await signInWithEmail(formData.email, formData.password)
            toast.success("Login successfully.");
            navigate(`/profile/${user.firebaseUid}`)

        } catch (e) {
            console.error(e);
            toast.error("Login failed.");
        }
        finally {
            setIsLoading(false);
        }
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
            title="Login"
        >
            <Stack
                component="form"
                onSubmit={onSubmit}
                spacing={2} sx={{mx: "auto"}}
            >
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

                <Button variant={"contained"}
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            if(validate()) {
                                void login();
                            }
                        }}
                >Login</Button>
                <Divider sx={{ my: 2 }}>
                    OR
                </Divider>
                <Button variant={"outlined"} startIcon={<GoogleIcon />} onClick={(e) => {
                    e.preventDefault();
                    void loginWithGoogle();
                }}>Login via Google</Button>

            </Stack>
        </TitledBox>
    )
}
