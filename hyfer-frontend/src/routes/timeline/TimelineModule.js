import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import grey from '@material-ui/core/colors/grey';
import TimelineMenu from './TimelineMenu';
import classNames from 'classnames';

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit / 2,
  },
  container: {
    // margin: halfUnit,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer',
    boxSizing: 'border-box',
    border: `solid 4px transparent`,
  },
  selected: {
    border: `dashed 4px ${grey[700]}`,
    color: 'green',
  },
  moduleName: {
    color: 'white',
    marginLeft: theme.spacing.unit * 2,
  },
  menuButton: {
    opacity: 0.25,
    '&:hover': {
      opacity: 1,
    },
    [`@media(max-width: ${theme.breakpoints.values.sm}px)`]: {
      opacity: 1,
    },
  },
});

@inject('currentModuleStore', 'currentUserStore', 'userStore', 'timelineStore')
@observer
class TimelineModule extends Component {
  state = {
    anchorEl: null,
  };

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  itemClickHandler = (item) => {
    const { isStudent, isTeacher } = this.props.currentUserStore;
    if (isStudent || isTeacher) {
      this.props.currentModuleStore.getRunningModuleDetails(item.running_module_id);
    }
  };

  render() {
    const {
      module_name,
      duration,
      color,
      archived,
      running_module_id,
    } = this.props.item;

    // Add extra times width as much as needed but for the margin add all - 1 
    // (for the first item it doesn't need any margin)
    const { spacing } = this.props.theme;
    const { itemWidth, rowHeight } = this.props.timelineStore;
    const width = itemWidth * duration - spacing.unit;

    const { classes, currentUserStore } = this.props;
    const { currentModule } = this.props.currentModuleStore;
    const selected = currentModule && currentModule.id === running_module_id;

    return (
      <div className={classes.root}>
        <Paper elevation={2}
          className={classNames(classes.container, selected ? classes.selected : '')}
          style={{ width, height: rowHeight, backgroundColor: color }}
          onClick={() => this.itemClickHandler(this.props.item)}
        >
          <Typography
            variant="subheading"
            title={module_name}
            className={classes.moduleName}
            noWrap
          >
            {module_name}
          </Typography>
          {currentUserStore.isTeacher && archived === 0 && (
            <React.Fragment>
              <IconButton
                onClick={this.openMenu}
                className={classes.menuButton}
              >
                <MoreVertIcon color="action" />
              </IconButton>
              <TimelineMenu
                runningModuleId={running_module_id}
                anchorEl={this.state.anchorEl}
                onClose={this.closeMenu}
              />
            </React.Fragment>
          )}
        </Paper >
      </div>
    );
  }
}

TimelineModule.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
  currentUserStore: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  timelineStore: PropTypes.object.isRequired,
  userStore: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TimelineModule);
