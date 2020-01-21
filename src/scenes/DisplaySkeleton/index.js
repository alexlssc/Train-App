import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StorageIcon from '@material-ui/icons/Storage';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SignOutButton from '../../components/SignOut';
import * as ROUTES from "../../constants/routes";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function ResponsiveDrawer(props) {
    const { container } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [tacticCompOpen, setTacticCompOpen]= React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenTacticComp = () => {
        setTacticCompOpen(!tacticCompOpen);
    }


    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                <ListItem button component={Link} to={ROUTES.LANDING} key="dashboard">
                    <ListItemIcon><DashboardIcon/></ListItemIcon>
                    <ListItemText primary="Dashboard"/>
                </ListItem>
                <ListItem button component={Link} to={ROUTES.PLAYER_LIST} key="listPlayer">
                    <ListItemIcon><PeopleIcon/></ListItemIcon>
                    <ListItemText primary="Liste de joueurs"/>
                </ListItem>
                <ListItem button component={Link} to={ROUTES.TRAININGS} key="trainings">
                    <ListItemIcon><AssignmentIcon/></ListItemIcon>
                    <ListItemText primary="Entrainements"/>
                </ListItem>
                <ListItem button component={Link} to={ROUTES.TACTICS} key="tactics">
                    <ListItemIcon><AssignmentIndIcon/></ListItemIcon>
                    <ListItemText primary="Tactiques"/>
                </ListItem>
                <ListItem button component={Link} to={ROUTES.BESTELEVEN} key="bestXI">
                    <ListItemIcon><AccessibilityNewIcon/></ListItemIcon>
                    <ListItemText primary="Meilleur 11"/>
                </ListItem>
                <ListItem button onClick={handleOpenTacticComp} key="tacticCollapser">
                    <ListItemIcon>
                        <FindInPageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Comparateur Tactique" />
                    {tacticCompOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={tacticCompOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button component={Link} to={ROUTES.GAMERECORDS} key="tacticsComparator">
                            <ListItemIcon><StorageIcon/></ListItemIcon>
                            <ListItemText primary="Base de donnée"/>
                        </ListItem>
                        <ListItem button component={Link} to={ROUTES.STATSGAMERECORDS} key="statsGameRecord">
                            <ListItemIcon><ShowChartIcon/></ListItemIcon>
                            <ListItemText primary="Stats"/>
                        </ListItem>
                    </List>
                </Collapse>
            </List>
            <Divider />
            <List>
                <SignOutButton/>
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Train App
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.content}
            </main>
        </div>
    );
}

export default ResponsiveDrawer;