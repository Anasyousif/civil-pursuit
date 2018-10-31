'use strict';

import React from 'react';
import Icon from './util/icon';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import Row from './util/row';
import TextInput from './util/text-input';
import createRef from 'create-react-ref/lib/createRef';
React.createRef = createRef; // remove for React 16
import isURL from 'is-url';
import insertSheet from 'react-jss';
import superagent from 'superagent'
import S from 'string'
import publicConfig from '../../public.json';

const styles = {
    'reference': {
        padding: '0',
        margin: '0',
        'padding-bottom': `calc( ${publicConfig.itemVisualGap} * 0.5 )`,
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        'line-height': '1.375em',
        '&minified, &title, &none': {
            display: 'none'
        },
        '&truncated': {
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',

            a: {
                color: 'inherit',
                'text-decoration': 'none',
                '&:hover': {
                    'text-decoration': 'none'
                }

            }
        }
    },
    'looking-up': {
        display: 'none',
        "&$visible": {
            display: 'block'
        }
    },
    'error': {
        display: 'none',
        '&$visible': {
            display: 'block'
        }
    },
    'url-editor': {
        '&$hide': {
            display: 'none'
        },
        'input&': {
            'width': '100%',
            'border': 'none',
            'padding-left': 0,
        }
    },
    'url-title': {
        display: 'none',
        'input&': {
            border: 'none',
            'font-size': '0.9rem',
            'font-weight': '300',
            'font-family': "Oswald",
            'background-color': 'white',
            padding: `0 0 calc( ${publicConfig.itemVisualGap} * 0.5 ) 0`,
            width: '100%',
        }
    },
    'edit-url': {
        display: 'none'
    },
    visible: {
        display: 'block'
    },
    hide: {
        display: 'none'
    },
    'title': {
        display: 'none'
    }
}

// renders the references
class ItemReference extends React.Component {
    constructor(props) {
        super(props);
        this.link = React.createRef();
        this.inputElement = React.createRef();
        this.openURL = this.openURL.bind(this);
        this.onChangeKey = this.onChangeKey.bind(this);
        this.editURL = this.editURL.bind(this);
        this.getUrlTitle = this.getUrlTitle.bind(this);
        this.ignoreCR = this.ignoreCR.bind(this);
        this.state = { references: this.props.item && this.props.item.references && this.props.item.references.slice() || [] };
    }
    ignoreCR(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.getUrlTitle();
        }
    }
    openURL(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (!this.props.rasp.readMore) {
            this.props.rasp.toParent({ type: "TOGGLE_READMORE" })
            return;
        }
        let win = window.open(this.link.href, this.link.target);
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website in order to open links');
        }
    }
    componentWillReceiveProps(newProps) {
        let newReferences = newProps.item && newProps.item.references || [];
        if (!isEqual(this.state.references, newReferences))
            this.setState({ references: newReferences.slice() });
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    getUrlTitle() {
        var references = this.state.references;
        let { url } = references[0] || {};

        if (url && isURL(url)) {
            this.setState({
                titleLookingUp: true,
                titleError: false
            });
            window.socket.emit('get url title', url, title => {
                if (!title || title.error) {
                    this.setState({ titleLookingUp: false, titleError: true, errMsg: title && title.error || "Title not accessible" });
                } else {
                    if (title.length) {
                        references = references.slice();
                        references[0].title = title;
                        this.setState({ titleLookingUp: false, titleError: false, references });
                    } else
                        this.setState({ titleLookingUp: false, titleError: true });
                }
                if (this.props.onChange) this.props.onChange({ value: { references } })
            })
        }
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    editURL() {
        this.inputElement.current.select();
        var references = this.state.references.slice();
        references[0].title = '';
        this.setState({ references });
    }

    onChangeKey() {
        var references = this.state.references || [];
        var value = this.inputElement.current.value;
        if ((references[0] && references[0].url) !== value) {
            references = references.slice();
            references[0] = { url: value };
            this.setState({ references });
        }
    }

    render() {
        const { item, classes, className, truncShape, noReference } = this.props;
        const { references, lookingUp, titleError, errMsg } = this.state;
        const { title, url } = references[0] || {};
        if (truncShape !== 'edit') {
            if (!references.length) return null;
            return (
                <h5 className={cx(className, classes['reference'], classes[truncShape], noReference && classes['hide'])} >
                    <a href={url} onClick={this.openURL} ref={this.link} target="_blank" rel="nofollow"><span>{title}</span></a>
                </h5>
            );
        } else {
            if(item.type && item.type.referenceMethod==="disabled") 
                return null;
            else 
                return (
                    <Row center-items>
                        <Icon
                            icon="globe"
                            spin={true}
                            className={cx(classes['looking-up'], lookingUp && classes['visible'])}
                            key="globe"
                        />

                        <Icon 
                            icon="exclamation" 
                            className={cx(classes['error'], titleError && classes['visible'])} 
                            title={errMsg}
                        />

                        <TextInput
                            block
                            placeholder="https://"
                            ref={this.inputElement}
                            onChange={this.onChangeKey}
                            onBlur={this.getUrlTitle}
                            onKeyDown={this.ignoreCR}
                            className={cx(classes['url-editor'], title && classes['hide'])}
                            name="reference"
                            value={url}
                            key="reference"
                        />
                        <TextInput
                            disabled
                            name="url-title"
                            value={title}
                            className={cx(classes['url-title'], title && classes['visible'])}
                            key="title"
                            onClick={this.editURL}
                        />

                        <Icon
                            icon="pencil"
                            mute
                            className={cx(classes['edit-url'], title && classes['visible'])}
                            onClick={this.editURL}
                            key="pencil"
                        />
                    </Row>
                );
        }
    }
}

export default insertSheet(styles)(ItemReference);
