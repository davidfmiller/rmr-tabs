/* global document,window,Element,module,require */

(function() {

  'use strict';

  const
  RMR = require('rmr-util'),
  tabs = function(options) {

    const
      sets = RMR.Node.getAll('.rmr-tabs'),
      show = (li) => {
        const
          link = RMR.Node.get('a', li),
          parent = RMR.Node.ancestor(li, '.rmr-tabs'),
          key = li.getAttribute('data-rmr-tab'),
          links = RMR.Node.getAll('.rmr-filters a', parent),
          list = parent.querySelector('.rmr-list ul') || parent.querySelector('.rmr-list ol');

        if (! RMR.Node.get(':scope .rmr-master', parent)) {
          const
            dupe = list.cloneNode(true);

          RMR.Node.setAttributes(dupe, {
            class: 'rmr-master',
            'aria-hidden': true,
            id: null
          });
          parent.appendChild(dupe);
        }

        // if already active then no more action is necessary
        if (li.classList.contains('active')) {
          return;
        }

        // add active to proper filter
        links.map((n) => {
          const li = RMR.Node.ancestor(n, 'li', false);
          li.classList.remove('active');
        });
        li.classList.add('active');

        parent.classList.add('rmr-filtering');
        window.setTimeout(() => {
          RMR.Node.prune(list);

          const items = RMR.Node.getAll(':scope .rmr-master > li', parent);
          items.map((n) => {
            const tags = n.getAttribute('data-rmr-tab').trim().split(' ');
            if (! key || key === 'all' || tags.indexOf(key) >= 0) {
              const dupe = n.cloneNode(true);
              list.appendChild(dupe);
            }
          });
          parent.classList.remove('rmr-filtering');
        }, 500);

      },
      clicker = (e) => {
//        e.preventDefault();
        const
          li = RMR.Node.ancestor(e.target, 'li', true);
        show(li);
      };

    for (const i in sets) {
      if (! RMR.Object.has(sets, i)) {
        continue;
      }
      const links = RMR.Node.getAll('.rmr-filters a', sets[i]);
      links.map((a) => { a.addEventListener('click', clicker) });
    }

    const
      hash = document.location.hash ? document.location.hash.substr(1) : null,
      lis = RMR.Node.getAll('.rmr-filters > * > li');

    if (! hash) {
      return
    }
    lis.map((li) => {
      if (li.getAttribute('data-rmr-tab') === hash) {
        show(li);
      }
    });
  };

  module.exports = tabs;

})();

