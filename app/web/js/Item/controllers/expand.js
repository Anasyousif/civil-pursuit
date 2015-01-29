/** Item/Expand
 *
 *  Expands an item's subpanel
 */


! function () {
  
  'use strict';

  /**
   *  @function expand
   *  @arg {Object} item
   *  @arg {Object} $panel
   *  @arg {Object} $item
   *  @arg {Object} $children
   *  @arg {Object} $toggleArrow
  */

  function expand (item, $panel, $item, $children, $toggleArrow) {

    var div     =   this;
    var Panel   =   div.root.extension('Panel');

    function panel () {
      return {
        type: children,
        parent: item._id,
        size: synapp['navigator batch size'],
        skip: 0
      };
    };

    // Hide panel's creator

    if ( $panel.find('>.panel-body >.creator.is-shown').length ) {
      Panel.controller('hide')($panel.find('>.panel-body >.creator.is-shown'));
    }

    // Is loaded so just show  
    
    if ( $children.hasClass('is-loaded') ) {
      Panel.controller('reveal')($children, $item);

      $toggleArrow
        .find('i.fa')
        .removeClass('fa-arrow-down')
        .addClass('fa-arrow-up');
    }

    // else load and show
    
    else {
      $children.addClass('is-loaded');

      setTimeout(function () {
        $toggleArrow.find('i.fa')
          .removeClass('fa-arrow-down')
          .addClass('fa-arrow-up');
        }.bind(this), 1000);

      return;

      var children = synapp['item relation'][item.type];

      if ( typeof children === 'string' ) {
        Panel.push('panels', panel());
      }

      else if ( Array.isArray(children) ) {
        children.forEach(function (child) {

          if ( typeof child === 'string' ) {
            Panel.push('panels', panel());
          }

          else if ( Array.isArray(child) ) {
            child.forEach(function (c) {

              var p = panel();
              p.split = true;

              Panel.push('panels', p);
            });
          }

        });
      }
    }
  }

  module.exports =  expand;

}();
