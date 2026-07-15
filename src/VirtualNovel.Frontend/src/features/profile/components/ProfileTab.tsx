import {Box, Tabs,Tab, Typography} from "@mui/material";
import {useState} from "react";
import Think from "./tabs/Think.tsx";
import type {UserProfileDto} from "../type.ts";
import NovelList from "./NovelList.tsx";
interface Props  {
    user : UserProfileDto
}

export default function ProfileTab({user}: Props) {
    type Tab ={
        label: string;
        tabView: React.ReactNode
    }
    const tabs : Tab[] = [
        {
            label: "Thoughts",
            tabView : <Think/>
        },
        {   label: "Novels",
            tabView: <NovelList authorId={user.firebaseUid}/>
        },
        {
            label: "Reding List",
            tabView: <Typography>Reding List</Typography>
        },
        {
            label: "Bookmarks",
            tabView: <Typography>Bookmarks</Typography>
        },
        {
            label: "Following",
            tabView: <Typography>Subscriptions</Typography>
        },
        {
            label: "Settings",
            tabView: <Typography>Settings</Typography>
        }
    ]
    const [value, setValue] = useState(tabs[0].label);

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    const currentTab = tabs.find(x => x.label === value);
    return (
        <Box sx={{
            borderRadius: 0.25,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
        }}>
            <Tabs
                value={value}
                onChange={handleChange}
                sx={{marginBottom: 2}}
            >
                {tabs.map(tab => (
                    <Tab
                        key={tab.label}
                        value={tab.label}
                        label={tab.label}
                     />
                ))}
            </Tabs>

            {currentTab?.tabView}

        </Box>
    )
}
