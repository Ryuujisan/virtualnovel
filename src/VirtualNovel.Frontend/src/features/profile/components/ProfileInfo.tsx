import type {UserProfileDto} from "../type.ts";
import {Autocomplete, Avatar, Box, Button, IconButton, Stack, TextField, Typography} from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {useUserStore} from "../../../store/userStore.ts";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {formatUpdatedAt} from "../../../shared/helper.ts";
import {useState} from "react";
import {toast} from "react-toastify";
import type {EnsureProfileRequest} from "../request.ts";
import {updateProfile} from "../api.ts";


interface Props  {
    user : UserProfileDto
}


export default function ProfileInfo({user} : Props) {

    const [formData, setFormData] = useState({
        name: user.displayName,
        bio: user.bio,
        url: user.avatarUrl,
        gender: user.gender,
    });

    const meProfile = useUserStore(x => x.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const updateUser = useUserStore(x => x.updateUser);
    const canEdit = meProfile?.firebaseUid === user?.firebaseUid;
    const gender = ["None", "Female", "Male"];

    async function update() {
        try {
            setIsLoading(true);
            const requst: EnsureProfileRequest = {
                name: formData.name ?? user.displayName ?? user.firebaseUid,
                bio: formData.bio,
                avatarUrl: formData.url,
                gender: formData.gender,
            }
            console.log(requst)
            const u = await updateProfile(requst);
            updateUser(u);
            toast.success("Profile updated successfully.");
            setIsLoading(false);

        } catch(e) {
            console.error(e);
            toast.error("Error update profile");
        }
    }

    return (
        <Box sx={{
            borderRadius: 0.25,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            }}>
            <Stack spacing={2} sx={{alignItems: "center", marginTop: 1, marginBottom: 2}}>
                <Box
                    sx={{
                        position: "relative",
                        width: 200,
                        height: 200,
                    }}
                >
                    <Avatar
                        src={user.avatarUrl ?? undefined}
                        alt="User avatar"
                        sx={{
                            width: 200,
                            height: 200,
                        }}
                    />

                    {canEdit && (
                        <IconButton
                            sx={{
                                position: "absolute",
                                bottom: 8,
                                right: 8,
                                bgcolor: "background.paper",
                                boxShadow: 2,

                                "&:hover": {
                                    bgcolor: "background.paper",
                                },
                            }}
                        >
                            <CameraAltIcon />
                        </IconButton>
                    )}
                </Box>
                <TextField id="name-basic" variant="standard" disabled={!canEdit} value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                <Autocomplete
                    disablePortal
                    options={gender}
                    sx={{ width: 250 }}
                    disabled={!canEdit}
                    value={formData.gender}
                    renderInput={(params) => <TextField {...params} label="Gender" />}
                    onChange={(_, value) => setFormData({...formData, gender: value!})}

                />
                <TextField
                    id="outlined-multiline-flexible"
                    label="Biography"
                    multiline
                    disabled={!canEdit}
                    value={formData?.bio ?? ""}
                    sx={{ width: 250 }}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
                <Typography>Joined {formatUpdatedAt(user?.createdAt ?? "")} <CalendarMonthIcon/></Typography>
                <Typography>Last update {formatUpdatedAt(user?.updatedAt ?? "")} <CalendarMonthIcon/></Typography>
                {canEdit &&<Button variant={"contained"} disabled={isLoading} onClick={(e) => {
                    e.preventDefault();
                    void update()
                }}>Update Profile</Button>}
            </Stack>
        </Box>
    )
}
