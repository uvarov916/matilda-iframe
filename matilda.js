function sbis_escape_html(str) {
    if (typeof str == 'string') {
       return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    } else {
       return str;
    }
 }
 
 function sbis_set_cookie(name, value, expires_date) {
    var expires = '';
    if (expires_date) {
       expires = '; expires='+expires_date.toGMTString();
    }
    document.cookie = name+'='+value+expires+'; path=/';
 }
 
 function sbis_read_cookie(name) {
    var
       cookies = document.cookie.split(';'),
       cookie;
    name += '=';
    for (var i=0; i < cookies.length; i++) {
       cookie = cookies[i];
       while (cookie.charAt(0) == ' ') {
          cookie = cookie.substring(1, cookie.length);
       }
       if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
       }
    }
    return undefined;
 }
 
 function sbis_get_number(val) {
    if (typeof(val) === 'string' && val.indexOf('px') >= 0) {
       val = val.slice(0, -2);
    }
    var n = Number(val);
    return n === null || isNaN(n) ? 0 : n;
 }
 
 function sbis_add_class(target, class_name) {
    if (!!target.classList) {
       return target.classList.add(class_name);
    }
    var classes = target.getAttribute('class');
    classes = classes? classes.split(' ') : [];
    for (var i, len = classes.length; i < len; i++) {
       if (classes[i] === class_name) {
          return;
       }
    }
    target.className = classes.join(' ')+' '+class_name;
 }
 
 function sbis_remove_class(target, class_name) {
    if (!!target.classList) {
       return target.classList.remove(class_name);
    }
    var classes = target.getAttribute('class');
    classes = classes? classes.split(' ') : [];
    for (var i = 0, new_classes = '', len = classes.length; i < len; i++) {
       if (classes[i] !== class_name) {
          new_classes += classes[i]+' ';
       }
    }
    target.className = new_classes;
 }
 
 function sbis_add_browser_classes(target, browser) {
    var classes = [];
    if (browser.isIE) {
       classes.push('sbis_is_ie');
    }
    if (browser.isIE10) {
       classes.push('sbis_is_ie10');
    }
    if (browser.isIE11) {
       classes.push('sbis_is_ie11');
    }
    if (browser.isIE12) {
       classes.push('sbis_is_ie12');
    }
    if (browser.firefox) {
       classes.push('sbis_is_firefox');
    }
    if (browser.chrome) {
       classes.push('sbis_is_chrome');
       if (browser.isMobileIOS && browser.isMobileIOS < 11) {
          classes.push('sbis_is_mobile_chrome_ios');
       }
    }
    if (browser.isMobileAndroid) {
       classes.push('sbis_is_mobile_android');
    }
    if (browser.isMobileSafari) {
       classes.push('sbis_is_mobile_safari');
       if ((browser.IOSVersion || 0) < 8) {
          classes.push('sbis_is_mobile_safari_ios_below_8');
       }
    }
    if (browser.isMobileIOS) {
       classes.push('sbis_is_mobile_ios');
    }
    if (browser.isMobilePlatform) {
       classes.push('sbis_is_mobile_platform');
    } else {
       classes.push('sbis_is_desktop_platform');
    }
    if (browser.isMacOSDesktop && browser.safari) {
       classes.push('sbis_is_desktop_safari');
    }
    if (browser.webkit) {
         classes.push('sbis_is_webkit');
    }
    if (browser.retailOffline) {
        classes.push('sbis_is_sbis_desktop');
    }
    for (var i=0; i<classes.length; i++) {
       sbis_add_class(target, classes[i]);
    }
 }
 
 function sbis_get_viewport_size() {
    var element = document.compatMode === 'BackCompat' ? document.body : document.documentElement;
    return {
       width: element.clientWidth,
       height: element.clientHeight
    };
 }
 
 function sbis_attach_event(target, event_name, handler) {
    if (target.addEventListener) {
       return target.addEventListener(event_name, handler);
    } else {
       return target.attachEvent('on'+event_name, handler);
    }
 }
 
 function sbis_remove_event(target, event_name, handler) {
    if (target.removeEventListener) {
       return target.removeEventListener(event_name, handler);
    } else {
       return target.detachEvent('on'+event_name, handler);
    }
 }
 
 function sbis_consultant(options, state) {
    var
       self = this,
       button = function(cfg) {
          var
             button = document.createElement('div'),
             border = document.createElement('div');
          sbis_add_class(button, 'sbis_consultant__button');
          sbis_add_class(button, 'sbis_shadow');
          if (cfg.className) {
             cfg.className.split(' ').forEach(function(val, i, arr) {
                val && button.classList.add(val);
             });
          }
          if (cfg.handlers) {
             for(var i in cfg.handlers) {
                cfg.handlers.hasOwnProperty(i) && sbis_attach_event(button, i, cfg.handlers[i]);
             }
          }
          sbis_add_class(border, 'sbis_consultant_border');
          button.appendChild(border);
          button.style.opacity = 0;
          return button;
       },
       buttons_container = function() {
          var container = document.createElement('div');
          container.setAttribute('id', 'sbis_consultant_buttons');
          sbis_add_browser_classes(container, self.options.browser);
          return container;
       },
       get_source_link = function(section) {
          var
             query_data = {
                's': window.location.host,
                'p': window.location.pathname,
                't': window.document.title
             },
             encoded_query_data = window.btoa ? window.btoa(window.encodeURIComponent(window.JSON.stringify(query_data))) : 'null';
          return self.options.resources_root + section + self.options.channel_uuid + '/?p=' + encoded_query_data;
       };
 
    self.send_message = function(action, value) {
        var self = this;
 
       if (self.state.window) {
          self.state.window.postMessage(
             JSON.stringify({channel: self.options.channel_uuid, action: action, value: value}),
             '*'
          );
       }
    };
 
    self.toggle_indicator = function(toggle) {
       var self = this;
        if (toggle === true) {
          sbis_remove_class(self.window.loader.main_div, 'sbis_hidden');
       } else if (toggle === false) {
          sbis_add_class(self.window.loader.main_div, 'sbis_hidden');
       }
    };
 
    self._build_resource_link = function(resource_link) {
       resource_link = resource_link.split('.');
       if (resource_link.length > 1) {
          resource_link[resource_link.length-2] = resource_link[resource_link.length-2]+self.options.resources_postfix;
 
       }
       return self.options.resources_root+resource_link.join('.');
    };
 
    self.toggle_window = function(toggle, without_notify) {
       toggle = toggle === true;
       without_notify = without_notify === true;
       var
          self = this,
          redraw_frame = false;
       if (toggle) {
          if (!self.window.main_div) {
             self.create_window();
             return;
          }
 
          sbis_remove_event(window, 'focusin', self._before_load_focus);
          sbis_remove_event(window, 'blur', self._before_load_blur);
 
          if (self.state.in_frame === false && !self.state.window.closed) {
             self.state.window.focus();
             return;
          } else if (self.state.in_frame === false && self.state.window.closed) {
             redraw_frame = true;
          }
          self.state.time_to_open = undefined;
          if (redraw_frame) {
             self.toggle_indicator(true);
             self.window.frame.src = self.options.frame_src;
             self.state.in_frame = true;
             self.state.window = self.window.frame.contentWindow;
          }
          if (!without_notify) {
             self.send_message('openWindow');
          }
          sbis_remove_class(self.window.main_div, 'sbis_hidden');
          setTimeout(
             function() {
                self.window.main_div.style.opacity = '1';
             },
             1
          );
 
          self.button.main_div.style.opacity = '0';
          setTimeout(
             function() {
                sbis_add_class(self.button.main_div, 'sbis_hidden');
             },
             300
          );
       } else {
          self.send_message('closeWindow');
          sbis_remove_class(self.button.main_div, 'sbis_hidden');
          setTimeout(
             function() {
                self.button.main_div.style.opacity = '1';
             },
             1
          );
 
          self.window.main_div.style.opacity = '0';
          setTimeout(
             function() {
                sbis_add_class(self.window.main_div, 'sbis_hidden');
             },
             300
          );
       }
       self.state.opened = toggle;
    };
 
    self.change_operator_state = function(state, first_call) {
       first_call = first_call === true;
       var self = this;
 
       if (first_call || state.operator_photo !== self.state.operator_photo) {
          self.button.operator_photo.setAttribute('src', self.options.site_root+state.operator_photo);
          self.state.operator_photo = state.operator_photo;
       }
       if (first_call || state.unread_count !== self.state.unread_count) {
          var unread_count = state.unread_count > 99 ? '99+' : String(state.unread_count);
          self.button.unread.innerHTML = '<span>'+sbis_escape_html(unread_count)+'</span>';
          if (parseInt(state.unread_count) > 0) {
             sbis_remove_class(self.button.unread, 'sbis_hidden');
          } else {
             sbis_add_class(self.button.unread, 'sbis_hidden');
          }
          self.state.unread_count = state.unread_count;
       }
 
       self.state.is_online = state.is_online;
    };
 
    self._area_change_dimensions = function(dimensions) {
       var
          ap = this,
          check_size_position = function(size, position) {
             if (
                dimensions[position] >= 0 &&
                dimensions[size]+dimensions[position] <= ap['client_'+size] &&
                dimensions[size] >= ap['area_min_'+size]
             ) {
                dimensions[size] = dimensions[size];
                dimensions[position] = dimensions[position];
             } else if (dimensions[position] < 0) {
                dimensions[position] = 0;
                if (dimensions[size] != ap['area_start_'+size]) {
                   dimensions[size] = ap['area_start_'+position]+ap['area_start_'+size];
                }
             } else if (dimensions[size]+dimensions[position] > ap['client_'+size]) {
                if (dimensions[position] > ap['area_start_'+position]) {
                   dimensions[position] = ap['client_'+size]-dimensions[size];
                } else if (!ap.mouse_move_attached && dimensions[position] === 0 && dimensions[size] > ap['area_min_'+size]) {
                   dimensions[size] = ap['client_'+size]-ap['area_start_'+position];
                } else if (!ap.mouse_move_attached && dimensions[position] > 0 && dimensions[size] >= ap['area_min_'+size]) {
                   dimensions[position] = ap['client_'+size]-dimensions[size];
                } else {
                   dimensions[size] = ap['client_'+size]-dimensions[position];
                }
             } else if (dimensions[size] < ap['area_min_'+size]) {
                dimensions[size] = ap['area_min_'+size];
                if (dimensions[position] != ap['area_start_'+position]) {
                   dimensions[position] = ap['area_start_'+position]+ap['area_start_'+size]-ap['area_min_'+size];
                }
             }
          };
 
       check_size_position('width', 'left');
       check_size_position('height', 'top');
 
       for (var attr in dimensions) {
          if (!dimensions.hasOwnProperty(attr)) {
             continue;
          }
          ap.area.style[attr] = dimensions[attr]+'px';
       }
    };
 
    self._mouse_move_handler = function(event) {
       var ap = this;
       if (!ap.mouse_move_attached) {
          return;
       }
       event = event || window.event;
       var target = event.target !== null ? event.target : event.srcElement;
       ap.target = target;
       ap.mouse_left = event.clientX;
       ap.mouse_top = event.clientY;
       ap.client_width = sbis_get_viewport_size().width-(ap.area_margin_left+ap.area_margin_right);
       ap.client_height = sbis_get_viewport_size().height-(ap.area_margin_top+ap.area_margin_bottom);
 
       var dimensions = ap.user_handlers.mouse_move.call(ap);
 
       self._area_change_dimensions.call(ap, dimensions);
 
       if (ap.user_handlers.after_modify && typeof ap.user_handlers.after_modify === 'function') {
          ap.user_handlers.after_modify.call(ap);
       }
    };
 
    self._dummy_handler = function(event) {
       event = event || window.event;
       if (event.preventDefault) {
          event.preventDefault();
       } else {
          event.returnValue = false;
       }
       return false;
    };
 
    self._fill_ap_object = function(ap) {
       var area_style = ap.area.currentStyle || window.getComputedStyle(ap.area);
       ap.area_margin_top = sbis_get_number(area_style.marginTop);
       ap.area_margin_bottom = sbis_get_number(area_style.marginBottom);
       ap.area_margin_left = sbis_get_number(area_style.marginLeft);
       ap.area_margin_right = sbis_get_number(area_style.marginRight);
       ap.area_min_width = sbis_get_number(area_style.minWidth);
       ap.area_min_height = sbis_get_number(area_style.minHeight);
       ap.area_start_height = sbis_get_number(ap.area.offsetHeight);
       ap.area_start_width = sbis_get_number(ap.area.offsetWidth);
       ap.area_start_left = sbis_get_number(ap.area.offsetLeft)-ap.area_margin_left;
       ap.area_start_top = sbis_get_number(ap.area.offsetTop)-ap.area_margin_top;
       ap.client_width = sbis_get_viewport_size().width-(ap.area_margin_left+ap.area_margin_right);
       ap.client_height = sbis_get_viewport_size().height-(ap.area_margin_top+ap.area_margin_bottom);
       return ap;
    };
 
    self._mouse_handler = function(area, handles, handlers) {
       //ap - area properties
       var ap = {
          area: area,
          user_handlers: handlers,
          area_height: 0,
          area_width: 0,
          area_left: 0,
          area_top: 0,
          mouse_start_left: 0,
          mouse_start_top: 0,
          mouse_left: 0,
          mouse_top: 0,
          mouse_move_attached: false,
          target: null
       };
       ap.handlers = {
          mouse_move: self._mouse_move_handler.bind(ap),
          dummy: self._dummy_handler.bind(ap)
       };
 
       sbis_attach_event(
          window,
          'mousedown',
          function(event) {
             event = event || window.event;
 
             var target = event.target !== null ? event.target : event.srcElement;
             if (
                (event.button == 1 && window.event !== null || event.button === 0) &&
                handles.indexOf(target) >= 0
             ) {
                if (event.preventDefault) {
                   event.preventDefault();
                } else {
                   event.returnValue = false;
                }
 
                ap.target = target;
                ap.mouse_start_left = event.clientX;
                ap.mouse_start_top = event.clientY;
                ap.mouse_move_attached = true;
 
                self._fill_ap_object(ap);
 
                sbis_attach_event(window, 'mousemove', ap.handlers.mouse_move);
                sbis_attach_event(window, 'selectstart', ap.handlers.dummy);
                sbis_attach_event(window, 'dragstart', ap.handlers.dummy);
                target.focus();
 
                ap.user_handlers.mouse_down.call(ap);
                return false;
             }
          }
       );
 
       sbis_attach_event(
          window,
          'mouseup',
          function() {
             if (ap.mouse_move_attached) {
                ap.mouse_move_attached = false;
                ap.target = null;
 
                sbis_remove_event(window, 'mousemove', ap.handlers.mouse_move);
                sbis_remove_event(window, 'selectstart', ap.handlers.dummy);
                sbis_remove_event(window, 'dragstart', ap.handlers.dummy);
 
                ap.user_handlers.mouse_up.call(ap);
             }
          }
       );
 
    };
 
    self._loader_resize_handler = function() {
       var ap = this;
       self.window.loader.indicator.style.top = (
          ap.area.offsetHeight-self.window.loader.indicator.offsetHeight
       )/2+'px';
       self.window.loader.indicator.style.left = (
          ap.area.offsetWidth-self.window.loader.indicator.offsetWidth
       )/2+'px';
    };
 
    self._toggle_draggable = function() {
       var handlers = {};
 
       handlers.mouse_down = function() {
          var ap = this;
          sbis_add_class(ap.area, 'sbis_dragging');
          self.window.overlay.style.cursor = 'move';
       };
 
       handlers.mouse_move = function() {
          var ap = this;
          return {
             height: ap.area_start_height,
             width: ap.area_start_width,
             top: ap.area_start_top+ap.mouse_top-ap.mouse_start_top,
             left: ap.area_start_left+ap.mouse_left-ap.mouse_start_left
          };
       };
 
       handlers.mouse_up = function() {
          var ap = this;
          sbis_remove_class(ap.area, 'sbis_dragging');
          self.window.overlay.style.cursor = '';
       };
 
       self._mouse_handler(self.window.main_div, [self.window.header.dragger], handlers);
 
       sbis_attach_event(
          window,
          'resize',
          function() {
             var
                ap = self._fill_ap_object({
                   area: self.window.main_div
                }),
                dimensions = {
                   height: ap.area_start_height,
                   width: ap.area_start_width,
                   top: ap.area_start_top,
                   left: ap.area_start_left
                };
             self._area_change_dimensions.call(ap, dimensions);
             self._loader_resize_handler.call(ap);
          }
       );
 
       sbis_add_class(self.window.main_div, 'sbis_draggable');
       sbis_add_class(self.window.header.dragger, 'sbis_dragger');
    };
 
    self._toggle_resizable = function() {
       var
          handlers = {},
          handles_sides = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'],
          handles_elements = {},
          handles_elements_arr = [];
 
       for (var i = 0; i < handles_sides.length; i++) {
          handles_elements[handles_sides[i]] = document.createElement('div');
          sbis_add_class(handles_elements[handles_sides[i]], 'sbis_resizable_handle');
          sbis_add_class(handles_elements[handles_sides[i]], 'sbis_resizable_handle_'+handles_sides[i]);
          handles_elements_arr.push(handles_elements[handles_sides[i]]);
          self.window.main_div.insertBefore(handles_elements[handles_sides[i]], self.window.main_div.firstChild);
       }
 
       handlers.mouse_down  = function() {
          for (var i in handles_elements) {
             if (!handles_elements.hasOwnProperty(i)) {
                continue;
             }
             if (handles_elements[i] === this.target) {
                this.mouse_move_side = i;
                break;
             }
          }
 
          sbis_add_class(this.area, 'sbis_resizing');
          self.window.overlay.style.cursor = this.mouse_move_side+'-resize';
       };
 
       handlers.mouse_move = function() {
          var
             ap = this,
             result = {
                height: ap.area_start_height,
                width: ap.area_start_width,
                top: ap.area_start_top,
                left: ap.area_start_left
             };
 
          if (ap.mouse_move_side.indexOf('e') >= 0) {
             result.width = ap.area_start_width+ap.mouse_left-ap.mouse_start_left;
          }
 
          if (ap.mouse_move_side.indexOf('w') >= 0) {
             result.left = ap.area_start_left+ap.mouse_left-ap.mouse_start_left;
             result.width = ap.area_start_width+ap.mouse_start_left-ap.mouse_left;
          }
 
          if (ap.mouse_move_side.indexOf('n') >= 0) {
             result.top = ap.area_start_top+ap.mouse_top-ap.mouse_start_top;
             result.height = ap.area_start_height+ap.mouse_start_top-ap.mouse_top;
          }
 
          if (ap.mouse_move_side.indexOf('s') >= 0) {
             result.height = ap.area_start_height+ap.mouse_top-ap.mouse_start_top;
          }
          return result;
       };
 
       handlers.mouse_up = function() {
          var ap = this;
          sbis_remove_class(ap.area, 'sbis_resizing');
          self.window.overlay.style.cursor = '';
       };
 
       handlers.after_modify = self._loader_resize_handler;
 
       var window_style = self.window.main_div.currentStyle || window.getComputedStyle(self.window.main_div);
 
       self.window.main_div.style['min-width'] = self.options.min_width-(sbis_get_number(window_style.marginLeft)+sbis_get_number(window_style.marginRight))+'px';
       self.window.main_div.style['min-height'] = self.options.min_height-(sbis_get_number(window_style.marginTop)+sbis_get_number(window_style.marginBottom))+'px';
       self._mouse_handler(self.window.main_div, handles_elements_arr, handlers);
       sbis_add_class(self.window.main_div, 'sbis_resizable');
    };
 
    self._message_handler = function(event) {
       event = event || window.event;
       var
          self = this,
          data;
       if (event.origin == self.options.site_root) {
          try {
             data = JSON.parse(event.data);
          } catch (e) {
             data = {};
          }
 
          if (data.channel == self.options.channel_uuid) {
             switch(data.action) {
                case 'closeExpanded':
                   self.toggle_window(true);
                   break;
                case 'initComplete':
                   self.toggle_indicator(false);
                   self.state.initialized = true;
                   if (!self.state.opened && self.state.time_to_open && new Date().getTime() >= self.state.time_to_open) {
                      self.toggle_window(true, true);
                   }
                   break;
                case 'operatorStateChange':
                   self.change_operator_state(data.value);
                   break;
                default:
                   break;
             }
          }
       }
    };
 
    self.create_window = function(preload) {
       preload = preload === true;
       var self = this;
       self.window.overlay = document.createElement('div');
       self.window.header = {
          dragger: document.createElement('div'),
          main_div: document.createElement('div'),
          expand: document.createElement('span'),
          close: document.createElement('span')
       };
       self.window.loader = {
          indicator: document.createElement('div'),
          main_div: document.createElement('div')
       };
       self.window.frame = document.createElement('iframe');
       self.window.main_div = document.createElement('div');
       self.options.frame_src = get_source_link('/ConsultantVDom.html?withoutLayout=true&channelUUID=');
       self.window.overlay.setAttribute('id', 'sbis_consultant_overlay');
 
       // На мобилбных устройствах консультант разворачавается по размеру окна браузера.
       if (self.options.browser.isMobilePlatform) {
          var
             consultantWindow = self.window.main_div,
             consultantButton = self.button.main_div,
             resizeElement = (function(width, height) {
                var currentSize = this.getBoundingClientRect();
                if (width !== currentSize.width) {
                   this.style.width = width + 'px';
                }
                if (height !== currentSize.height) {
                   this.style.height = height + 'px';
                }
             }).bind(consultantWindow),
             resizeExpandedWindow = (function() {
                var bodySize = document.body.getBoundingClientRect();
                resizeElement(bodySize.width, bodySize.height);
             }).bind(consultantWindow),
 
             storePosition = (function() {
                if (this.previousPosition) {
                   this.previousPosition.top = this.style.top;
                   this.previousPosition.scrollY = window.pageYOffset;
                } else {
                   this.previousPosition = {
                      top: this.style.top,
                      scrollY: window.pageYOffset
                   };
                }
             }).bind(consultantWindow),
             toPreviousPosition = (function() {
                if (this.previousPosition) {
                   if (this.previousPosition.top) {
                      this.style.top = this.previousPosition.top;
                   }
                   if (this.previousPosition.scrollY) {
                      window.scrollTo(0, this.previousPosition.scrollY);
                   }
                }
             }).bind(consultantWindow),
 
             // Разворачивает окно консультанта на весь экран.
             expandHandler = function(withoutCurtail) {
                var
                   consultantWindow = self.window.main_div,
                   bodySize;
 
                // Запоминает текущее метоположение окна;
                storePosition();
 
                /**
                 * Пересчет размера:
                 * 1. При смене ориентации книжная/альбомная
                 * 2. При изменении размера окна браузера в случае, когда меняется размер
                 *    шапки браузера (ios, android) или появляется панель снизу (ios).
                 */
                sbis_attach_event(window, 'resize', resizeExpandedWindow);
 
                if (!withoutCurtail) {
                   // Отписывает от обработчика «Разворота» окна, дабы не увеличивалось повторно.
                   sbis_remove_event(this, 'click', expandHandler);
 
                   // Сворачивает окно при клике на кнопку развернуть/свернуть.
                   sbis_attach_event(this, 'click', curtailHandler);
                }
 
                /**
                 * Убирает скролл у родителя. Необходимо, чтобы избежать проблем со скроллом на
                 * iPad. Вешается на body исходя из того, что консультант добавляется в body.
                 * Устанавливает для body ширину и высоту 100%, чтобы элемент body был равен по
                 * размерам экрану. Необходимо, чтобы правильно пересчитывать размер
                 * развернутого/свёрнутого окна, а именно: на iPad, при масштабировании уменьшаются
                 * значения window.innerWidth, window.innerHeight, что ломает перерасчет размера
                 * окна. Размеры body остаются прежними.
                 */
                sbis_add_class(document.body, 'sbis_no_scroll');
 
                if (consultantWindow.classList.contains('sbis_hidden')) {
                   sbis_remove_class(consultantWindow, 'sbis_hidden');
                   consultantWindow.style.opacity = 1;
                }
 
                /**
                 * Убирает анимацию. В связи с костылем скролла для iPad выполняется пересчет
                 * «top». При сворачивании окна перерасчитывается top и окно появляется сверху.
                 * При развороте все хорошо.
                 */
                sbis_add_class(consultantWindow, 'sbis_transition_none');
 
 
                self.window.frame.setAttribute('scrolling', 'auto');
 
                /**
                 * Класс "прибивает" окно к левому верхнему углу, убирает отступы. Фиксирует
                 * позицию (position: fixed);
                 */
                sbis_add_class(consultantWindow, 'sbis_expanded');
                bodySize = document.body.getBoundingClientRect();
 
                // Увеличивает окно до размеров body.
                resizeElement(bodySize.width, bodySize.height);
 
                consultantWindow._expanded = true;
             },
 
             // Возвращает консультанту к состоянию по умолчанию (позиция, размер).
             curtailHandler = function() {
                var
                   consultantWindow = self.window.main_div,
                   isAndroid = self.options.browser.isMobileAndroid;
 
                // Убирает перерасчет (подписка в expandHandler);
                sbis_remove_event(window, 'resize', resizeExpandedWindow);
 
                // Отписывает от обработчика «Сворачивания» окна, дабы не уменьшалось повторно.
                sbis_remove_event(this, 'click', curtailHandler);
 
                // Разворачивает окно при клике на кнопку развернуть/свернуть.
                sbis_attach_event(this, 'click', expandHandler);
 
                // Возвращает body к предыдущему состоянию (см. expandHandler).
                sbis_remove_class(document.body, 'sbis_no_scroll');
 
                // Возвращает предыдущую позицию.
                toPreviousPosition();
 
                /**
                 * Класс удаляется перед тем, как запускается отрисовка, что приводит к тому,
                 * что браузер анимирует изменения стиля top, консультант появляется сверху.
                 */
                setTimeout(function() {
                   sbis_remove_class(consultantWindow, 'sbis_transition_none');
                }, 100);
 
                // Возвращает окно на предыдущую позицию (см. expandHandler).
                sbis_remove_class(consultantWindow, 'sbis_expanded');
 
                /**
                 *  Возвращает окно к дефолтным размерам.
                 *  isAndroid - костыль для андройда, т.к. размер окна браузера в альбомной
                 *  ориентации меньше self.options.min_height. Для правки нужно уменьшить высоту
                 *  «ConsultantTemplate-Chat» и вложенных элементов соответственно.
                 */
                resizeElement(self.options.min_width, isAndroid ? 420 : self.options.min_height);
 
                consultantWindow._expanded = false;
             };
 
          sbis_attach_event(consultantButton, 'click', expandHandler);
 
       } else {
          self.window.header.expand.setAttribute('title', 'Открыть в новом окне');
          self.window.header.expand.onclick = function() {
             self.state.window = window.open(
                self.options.frame_src,
                self.options.channel_uuid
             );
             self.state.in_frame = false;
             self.toggle_window(false);
             self.state.opened = true;
             self.window.frame.src = '';
          };
          self.window.header.close.setAttribute('title', 'Свернуть');
       }
 
       // Кнопки «Свернуть» нет на мобильных устройствах т.к. консультант открывается на всё окно.
       if (!self.options.browser.isMobilePlatform) {
          self.window.header.expand.setAttribute('id', 'sbis_consultant_header_expand');
       }
       self.window.header.close.setAttribute('id', 'sbis_consultant_close_button');
       self.window.header.close.onclick = function() {
          self.toggle_window(false);
          var expires_date = new Date();
          expires_date.setTime(expires_date.getTime() + 3600000);
          sbis_set_cookie('sbis_consultant_time_to_open', expires_date.getTime(), expires_date);
 
          if (document.body.classList.contains('sbis_no_scroll')) {
 
             // Возвращает body к предыдущему состоянию (см. expandHandler).
             sbis_remove_class(document.body, 'sbis_no_scroll');
 
             toPreviousPosition && toPreviousPosition();
          }
       };
 
 
       self.window.header.dragger.setAttribute('id', 'sbis_consultant_header_dragger');
 
       self.window.header.main_div.setAttribute('id', 'sbis_consultant_header');
       self.window.header.main_div.appendChild(self.window.header.dragger);
       self.window.header.main_div.appendChild(self.window.header.expand);
       self.window.header.main_div.appendChild(self.window.header.close);
 
 
       self.window.loader.indicator.setAttribute('id', 'sbis_consultant_loader_indicator');
       sbis_add_class(self.window.loader.indicator, 'sbis_shadow');
       self.window.loader.indicator.appendChild(document.createElement('span'));
       self.window.loader.indicator.childNodes[0].appendChild(document.createElement('span'));
       self.window.loader.indicator.childNodes[0].appendChild(document.createElement('img'));
       self.window.loader.indicator.childNodes[0].childNodes[0].innerHTML = 'Загрузка';
       self.window.loader.indicator.childNodes[0].childNodes[1].src = self._build_resource_link('/ws/img/themes/wi_scheme/ajax-loader-indicator.gif');
       self.window.loader.main_div.appendChild(self.window.loader.indicator);
 
       self.window.loader.main_div.setAttribute('id', 'sbis_consultant_loader');
       sbis_add_class(self.window.loader.main_div, 'sbis_hidden');
 
       self.window.frame.setAttribute('id', 'sbis_consultant_frame');
       self.window.frame.setAttribute('scrolling', 'no');
       self.window.frame.setAttribute('scrolling', 'no');
       self.window.frame.setAttribute('name', 'consultant-window-'+self.options.channel_uuid+'-frame');
       self.window.frame.setAttribute('src', self.options.frame_src);
 
       self.window.main_div.setAttribute('id', 'sbis_consultant_window');
 
       sbis_add_class(self.window.main_div, 'consultation-theme-'+self.options.theme_name);
       sbis_add_class(self.window.main_div, 'sbis_shadow');
       sbis_add_class(self.window.main_div, 'sbis_top_border');
       sbis_add_class(self.window.main_div, 'sbis_hidden');
       sbis_add_browser_classes(self.window.main_div, self.options.browser);
       self.window.main_div.style.opacity = '0';
       self.window.main_div.appendChild(self.window.overlay);
       self.window.main_div.appendChild(self.window.header.main_div);
       self.window.main_div.appendChild(self.window.loader.main_div);
       self.window.main_div.appendChild(self.window.frame);
       self.window.main_div._sbis_consultant = self;
 
       document.body.appendChild(self.window.main_div);
 
       var
          window_style = self.window.main_div.currentStyle || window.getComputedStyle(self.window.main_div),
          button_style = self.button.main_div.currentStyle || window.getComputedStyle(self.button.main_div);
       self.window.main_div.style.bottom = (sbis_get_number(button_style.bottom)-sbis_get_number(window_style.marginBottom))+'px';
       self.window.main_div.style.right = (sbis_get_number(button_style.right)-sbis_get_number(window_style.marginRight))+'px';
       self.window.main_div.style.width = (self.options.min_width-(sbis_get_number(window_style.marginLeft)+sbis_get_number(window_style.marginRight)))+'px';
       self.window.main_div.style.height = (self.options.min_height-(sbis_get_number(window_style.marginTop)+sbis_get_number(window_style.marginBottom)))+'px';
 
       self.state.window = self.window.frame.contentWindow;
       self.state.in_frame = true;
 
       // Изменение размера и перенос окна консультанта доступны только на десктопе.
       if (!self.options.browser.isMobilePlatform) {
          self._toggle_draggable();
          self._toggle_resizable();
       }
 
       if (!preload) {
          self.toggle_window(true);
       }
       self.toggle_indicator(true);
 
       sbis_attach_event(window, 'message', self._message_handler.bind(self));
    };
 
    self._onready_handler = function(){
       setTimeout(
          function() {
             var buttons = self.button.main_div.querySelectorAll('.sbis_consultant__button');
             buttons.forEach(function(val, i , arr) {
                val.style.opacity = 1;
             });
             if (!self.options.new_consultation || self.options.browser.isMobilePlatform) {
                return;
             }
             self.state.time_to_open = Number(sbis_read_cookie('sbis_consultant_time_to_open')) || new Date().getTime()+5000;
             if (self.options.browser.IOSVersion !== 11) {
                setTimeout(
                   function() {
                      if (self.state.initialized && self.state.time_to_open && new Date().getTime() >= self.state.time_to_open) {
                         self.toggle_window(true, true);
                      }
                   },
                   5500
                );
             }
          },
          1
       );
    };
 
    self._before_load_focus = function() {
       if (!self.window || self.window.frame !== document.activeElement) {
          self.state.last_focus = document.activeElement;
       }
    };
 
    self._before_load_blur = function() {
       setTimeout(
          function() {
             var
                scroll_x = window.scrollX,
                scroll_y = window.scrollY;
             if (self.window && self.window.frame === document.activeElement) {
                self.window.frame.blur();
                sbis_remove_event(window, 'focusin', self._before_load_focus);
                sbis_remove_event(window, 'blur', self._before_load_blur);
                if (self.state.last_focus === document.body || !self.state.last_focus) {
                   self.state.last_focus = document.body.firstChild;
                   self.state.last_focus && self.state.last_focus.focus && self.state.last_focus.focus();
                   while (document.activeElement !== self.state.last_focus) {
                      if (self.state.last_focus) {
                         self.state.last_focus = self.state.last_focus.nextElementSibling;
                         self.state.last_focus && self.state.last_focus.focus && self.state.last_focus.focus();
                      } else {
                         break;
                      }
                   }
                } else {
                   self.state.last_focus.focus();
                }
                if (scroll_x != window.scrollX || scroll_y != window.scrollY) {
                   window.scrollTo(scroll_x, scroll_y);
                }
             }
          },
          1
       );
    };
 
    var
       chat_wrapper_css = document.createElement('link'),
       themes_css = document.createElement('link'),
       app_root = window.wsConfig ? window.wsConfig.appRoot : '',
       is_debug = app_root.indexOf('debug') >= 0;
 
    if (app_root.length > 0 && app_root[app_root.length-1] === '/') {
       app_root = app_root.slice(0, app_root.length-1);
    }
    if (app_root.length > 0 && app_root[0] !== '/') {
       app_root = '/'+app_root;
    }
    self.options = options || {};
    self.state = state || {};
    try{
       self.options.browser = JSON.parse(self.options.browser);
    } catch (e) {
       self.options.browser = {};
    }
    self.options.resources_root = self.options.site_root+app_root;
    self.options.resources_postfix = self.options.build_number !== '' && !is_debug ?'.v'+self.options.build_number : '';
    self.button = {
       main_div: buttons_container(),
       operator_photo: document.createElement('img'),
       unread: document.createElement('div'),
       border: document.createElement('div')
    };
    self.window = {};
 
    self.state.last_focus = document.activeElement;
    sbis_attach_event(window, 'focusin', self._before_load_focus);
    sbis_attach_event(window, 'blur', self._before_load_blur);
 
    themes_css.setAttribute('rel', 'stylesheet');
    themes_css.setAttribute('type', 'text/css');
    themes_css.setAttribute('href', self._build_resource_link('/resources/Consultant/Chat/resources/themes.css'));
    chat_wrapper_css.setAttribute('rel', 'stylesheet');
    chat_wrapper_css.setAttribute('type', 'text/css');
    chat_wrapper_css.setAttribute('href', self._build_resource_link('/resources/Consultant/Chat/resources/chatWrapper.css'));
 
    if (options.online_consultant) {
       self.create_window(true);
    }
 
    document.body.appendChild(themes_css);
    document.body.appendChild(chat_wrapper_css);
    sbis_attach_event(chat_wrapper_css, 'load', function() {
       var
          button_container = self.button.main_div,
          call_button = options.online_call && button({
             className: 'sbis_consultant__button_blue sbis_consultant__button_phone',
             handlers: {
                click: function() {
                   window.open(
                      get_source_link('/call/'),
                      'call-' + options.channel_uuid,
                      'status=no,menubar=no,toolbar=no,directories=no,location=no,titlebar=no,height=600,width=800,resizable=yes,scrollbars=no'
                   );
                }
             }
          }),
          chat_button = options.online_consultant && button({
             className: 'consultation-theme-' + self.options.theme_name,
             handlers: {
                click: function() {
                   self.toggle_window(true);
                }
             }
          });
       self.button.operator_photo.setAttribute('id', 'sbis_operator_photo');
       self.button.unread.setAttribute('id', 'sbis_consultant_unread');
       chat_button && chat_button.appendChild(self.button.unread);
       chat_button && chat_button.appendChild(self.button.operator_photo);
       call_button && button_container.appendChild(call_button);
       chat_button && button_container.appendChild(chat_button);
       button_container._sbis_consultant = self;
       self.change_operator_state(
          {
             operator_photo: self.state.operator_photo,
             is_online: self.state.is_online,
             unread_count: self.state.unread_count
          },
          true
       );
       if (button_container.children.length) {
          document.body.appendChild(button_container);
 
          if (document.readyState == 'complete') {
             self._onready_handler();
          } else {
             sbis_attach_event(window, 'load', self._onready_handler);
          }
       }
    });
 }
 
 (
    function() {
       var consultant = new sbis_consultant(
          {
             site_root: 'https://pre-test-consultant.sbis.ru',
             hello_text: 'КЕЕЕЕЕЕЕЕЕЕЕЕЕк',
             channel_uuid: '1521cae4-675b-41c8-9098-d581e4a8cbe6',
             contract_name: 'Техническая поддержка',
             theme_name: 'light',
             new_consultation: 'false' === 'true',
             browser: '{"webkit": true, "IEVersion": null, "isIE": false, "isIE10": false, "isMacOSMobile": false, "isWPMobilePlatform": false, "isModernIE": false, "isIE12": false, "operaChrome": false, "isMobileSafari": false, "isMacOSDesktop": false, "chrome": false, "retailOffline": false, "isMobileAndroid": false, "isMobilePlatform": false, "safari": false, "userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36", "IOSVersion": null, "isMobileIOS": false, "firefox": false, "opera": false, "isIE11": false}',
             build_number: '1515752484524f0b24a6d0827e767a946dbe85df63cc8',
             online_call: 'true' === 'true',
             online_consultant: 'true' === 'true',
             min_width: 320,
             min_height: 480
          },
          {
             is_online: 'true' === 'true',
             operator_photo: '/previewer/r/96/96/service/?method=Consultation.PhotoById&params=eyJwaG90b19pZCI6ICJkODQ0YWJhNS1jZjNlLTQ1ZmUtODIxZS00NGMwMGQ5NGYwZjcifQ%3D%3D&id=0',
             unread_count: Number('0')
          }
       );
       return consultant;
    }
 )();