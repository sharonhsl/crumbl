import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Analytics.css";
import Button from './Button';
import TopSites from './TopSites';
import StaleCookies from './StaleCookies';
import AboutCrumbl from './About';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Analytics = () => {
    const navigate = useNavigate();

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return <div className="analytics">
        <Button text="Return" onClick={() => navigate("/", { replace: true })} />
        <h1>Crumbl Dashboard</h1>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value}
                    onChange={handleChange}
                    aria-label="analytics"
                    textColor='inherit'
                    centered>
                    <Tab label="Top sites" {...a11yProps(0)} sx={{ fontFamily: "inherit" }} />
                    <Tab label="Stale cookies" {...a11yProps(1)} sx={{ fontFamily: "inherit" }} />
                    <Tab label="About" {...a11yProps(2)} sx={{ fontFamily: "inherit" }} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <TopSites />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <StaleCookies />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AboutCrumbl />
            </TabPanel>
        </Box>
    </div>
}

export default Analytics;
