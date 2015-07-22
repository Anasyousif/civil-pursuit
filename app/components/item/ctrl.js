'use strict';

import S                from 'string';
import Nav              from '../../lib/util/nav';
import readMore         from '../../lib/util/read-more';
import Controller       from '../../lib/app/controller';
import Promote          from '../../components/promote/ctrl';
import Details          from '../../components/details/ctrl';
import PanelCtrl        from '../../components/panel/ctrl';
import View             from './view';
import MediaController  from './controllers/media';
import toggleArrow      from './controllers/toggle-arrow';
import togglePromote    from './controllers/toggle-promote';

class ItemCtrl extends Controller {

  constructor (props) {
    super();

    this.props = props || {};

    if ( this.props.item ) {
      this.set('item', this.props.item);
    }

    this.componentName = 'Item';
    this.view = View;
  }

  listen () {
    let self = this;

    this.socket.once(
      'item image uploaded ' + this.props.item._id,
      item => {
        this.set('image', item.image);
      });
  }

  media () {
    return MediaController.apply(this);
  }

  makeRelated (cls) {
    var button = $('<button class="shy counter"><span class="' + cls +
      '-number"></span> <i class="fa"></i></button>');

    return button;
  }

  find (name) {
    switch ( name ) {
      case "subject":             return this.template.find('.item-subject a');

      case "description":         return this.template.find('.description');

      case "toggle promote":      return this.template.find('.item-toggle-promote');

      case "promote":             return this.template.find('.promote');

      case "reference":           return this.template.find(' > .item-text .item-reference a');

      case "media":               return this.template.find('.item-media:first');

      case "youtube preview":     return this.template.find('.youtube-preview:first');

      case "toggle details":      return this.template.find('.item-toggle-details:first');

      case "details":             return this.template.find('.details:first');

      case "buttons":             return this.template.find('> .item-buttons');

      case "editor":              return this.template.find('.editor:first');

      case "toggle arrow":        return this.template.find('.item-arrow:first');

      case "promotions":          return this.template.find('.promoted:first');

      case "promotions %":        return this.template.find('.promoted-percent:first');

      case "children":            return this.template.find('.children:first');

      case "collapsers"             :   return this.template.find('.item-collapsers:first');

      case "collapsers hidden"      :   return this.template.find('.item-collapsers:first:hidden');

      case "collapsers visible"     :   return this.template.find('.item-collapsers:first:visible');

      case "related count"          :   return this.template.find('.related-count');

      case "related"                :   return this.template.find('.related');

      case "related count plural"   :   return this.template.find('.related-count-plural');

      case "related name"           :   return this.template.find('.related-name');
    }
  }

  render (cb) {

    if ( ! this.rendered ) {
      setTimeout(() => this.listen());
      this.rendered = true;
    }

    let item = this.get('item');

    let self = this;

    self.toggleArrow = this.toggleArrow.bind(this);

    // Create reference to promote if promotion enabled

    this.promote = new Promote(this.props, this);

    // Create reference to details

    this.details = new Details(this.props, this);

    // Set ID

    this.template.attr('id', 'item-' + item._id);

    // Set Data

    this.template.data('item', this);

    // SUBJECT

    this.find('subject')
      .attr('href', '/item/' + item.id + '/' + S(item.subject).slugify().s)
      .text(item.subject)
      .on('click', function (e) {
        var link = $(this);

        var item = link.closest('.item');

        Nav.scroll(item, function () {
          history.pushState(null, null, link.attr('href'));
          item.find('.item-text .more').click();
        });

        return false;
      });

    // DESCRIPTION    

    this.find('description').text(item.description);

    // MEDIA

    if ( !  this.find('media').find('img[data-rendered]').length ) {
      this.find('media').empty().append(this.media());
    }

    this.on('set', (key, value) => {
      if ( key === 'image' ) {
        item.image = value;
        this.set('item', item);
        this.find('media').empty().append(this.media());
      }
    });

    // READ MORE

    this.find('media').find('img, iframe').on('load', () => {
      if ( ! this.template.find('.more').length ) {
        readMore(item, this.template);
      }
    }.bind(item));

    // REFERENCES

    if ( (item.references) && item.references.length ) {
      this.find('reference')
        .attr('href', item.references[0].url)
        .text(item.references[0].title || item.references[0].url);
    }
    else {
      this.find('reference').empty();
    }

    // PROMOTIONS

    this.find('promotions').text(item.promotions);

    // POPULARITY

    let popularity = item.popularity.number;

    if ( isNaN(popularity) ) {
      popularity = 0;
    }

    this.find('promotions %').text(popularity + '%');

    // CHILDREN / RELATED

    if ( ! this.find('buttons').find('.related-number').length ) {
      let buttonChildren = this.makeRelated('related');
      buttonChildren.addClass('children-count');
      buttonChildren.find('i').addClass('fa-fire');
      buttonChildren.find('.related-number').text(item.children);
      this.find('related').append(buttonChildren);
    }

    this.template.find('.children-count').on('click', function () {
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');
      // item.find('toggle arrow').click();
      self.toggleArrow(true, false);
    });

    // HARMONY

    if ( 'harmony' in item ) {
      var buttonHarmony = this.makeRelated('harmony');
      buttonHarmony.addClass('harmony-percent');
      buttonHarmony.find('i').addClass('fa-music');
      buttonHarmony.find('.harmony-number').text(item.harmony);
      this.find('related').append(buttonHarmony);
    }

    this.template.find('.harmony-percent').on('click', function () {
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');
      // item.find('toggle arrow').click();
      self.toggleArrow(false, true);
    });
    
    // TOGGLE PROMOTE

    this.find('toggle promote').on('click', function () {
      self.togglePromote($(this));
    });

    // TOGGLE DETAILS

    this.find('toggle details').on('click', function () {
      self.toggleDetails($(this));
    });

    cb();
  }

  togglePromote ($trigger) {
    return togglePromote.apply(this, [$trigger]);
  }

  toggleArrow (showSubtype, showHarmony) {
    return toggleArrow.apply(this, [showSubtype, showHarmony]);
  }

  toggleDetails ($trigger) {

    let $item       =   $trigger.closest('.item');
    let item        =   $item.data('item');

    let d = this.domain;

    function showHideCaret () {
      if ( item.find('details').hasClass('is-shown') ) {
        $trigger.find('.caret').removeClass('hide');
      }
      else {
        $trigger.find('.caret').addClass('hide');
      }
    }

    if ( item.find('promote').hasClass('is-showing') ) {
      return false;
    }

    if ( item.find('promote').hasClass('is-shown') ) {
      item.find('toggle promote').find('.caret').addClass('hide');
      require('../../lib/util/nav').hide(item.find('promote'));
    }

    var hiders = $('.details.is-shown');

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    require('../../lib/util/nav').toggle(item.find('details'), item.template, d.intercept(function () {

      showHideCaret();

      if ( item.find('details').hasClass('is-hidden') && item.find('collapsers visible').length ) {
        item.find('collapsers').hide();
      }

      if ( item.find('details').hasClass('is-shown') ) {

        if ( ! item.find('details').hasClass('is-loaded') ) {
          item.find('details').addClass('is-loaded');

          item.details.render(d.intercept());
        }

        if ( hiders.length ) {
          require('../../lib/util/nav').hide(hiders);
        }
      }
    }));
  }

}

export default ItemCtrl;
