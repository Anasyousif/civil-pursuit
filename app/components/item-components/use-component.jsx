'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion from 'react-proactive-accordion';
import TypeComponent from '../type-component';
import config from '../../../public.json';


exports.button = class UseComponentButton extends React.Component {

    donothing() {
        return false;
    }

    render() {
        let { active, item, min, buttonName, buttonTitle, numberField = 'children' } = this.props;
        if (item.subtype) {
            if (typeof buttonName === 'undefined') buttonName = item.subtype.buttonName || "Delve";
            if (typeof min === 'undefined') min = item.subtype.min || 2;
            if (typeof buttonTitle === 'undefined') buttonTitle = item.subtype.buttonTitle || {
                active: "Delve into a deeper level of this discussion",
                success: "Return to the higher level of this discusion",
                inactive: "After 2 people Upvote this, the discussion can continue at a deeper level"
            };
            var number = buttonName === 'Start Here' ? ' ' : (item[numberField] ? item[numberField] : 0);
            var success = false, inactive = false;
            var title = "";
            var onClick = this.props.onClick;

            if (item.promotions >= min) {
                if (active) {
                    success = true;
                    title = buttonTitle.success;
                } else {
                    title = buttonTitle.active;
                }
            } else {
                inactive = true;
                onClick = this.donothing.bind(this);
                title = buttonTitle.inactive;
            }

            return (
                <ButtonGroup>
                    <span className="civil-button-info">{number} </span>
                    <Button small shy success={success} inactive={inactive} title={title} onClick={onClick} className="subtype-button" title={title}>
                        <span className="civil-button-text">{buttonName}</span>
                    </Button>
                </ButtonGroup>
            );
        } else return null;
    }
}

exports.panel = class UseComponentPanel extends React.Component {
    mounted = false;
    state = { type: null };

    constructor(props) {
        super(props);
        const { type } = props;
        if (typeof type === 'string' && typeof window !== 'undefined') {
            window.socket.emit('get listo type', [type], this.okGetListoType.bind(this))
        } else
            this.state.type = this.props.type;
    }

    okGetListoType(typeList) {
        if (typeList && typeList.length && typeList[0]._id === this.props.type)
            this.setState({ type: typeList[0] });
    }

    render() {
        if (!this.state.type) return null;
        const { active, style, item, rasp } = this.props;
        if (this.mounted === false && active === false) return null; // don't render this unless it's active, or been rendered before
        else {
            const nextRASP = { shape: 'truncated', depth: rasp.depth, toParent: rasp.toParent } // RASP 1 to 1 case - subcomponents always start truncated, I'm not saving state so no change in depth, my parent is your parent
            this.mounted = true;
            return (
                <div className="toggler use-component" key={item._id + '-toggler-' + this.constructor.name}>
                    <Accordion
                        active={active}
                        style={style}
                    >
                        <TypeComponent
                            {...this.props}
                            rasp={nextRASP}
                            panel={{ parent: item, type: item.subtype, skip: 0, limit: config['navigator batch size'] }}
                            component={this.state.type.component}
                        />
                    </Accordion>
                </div>
            )
        }
    }
}