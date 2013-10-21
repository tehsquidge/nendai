
;(function ( $, window, document, undefined ) {

    var d = new Date(), pluginName = "nendai",
        defaults = {
            containerName: "nendai-calendar",
            container: null,
            day: d.getDate(),
            month: d.getMonth() +1,
            year: d.getFullYear(),
            type: "default" //also accept month
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;


        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {

            var _self = this;

            if($('#'+_self.options.containerName).length == 0)
                $('body').append('<div id="'+_self.options.containerName+'"></div>');
            _self.container = $('#'+_self.options.containerName);
            _self.container.hide();
            $(_self.element).focus( function(){ _self.generateCalendar(_self); } );
             _self.updateInput(_self);

        },

        generateCalendar: function(_self) {
            _self.container.show();
            var top = $(_self.element).offset().top + $(_self.element).outerHeight();
            var left = $(_self.element).offset().left;
            _self.container.offset( { top: top, left: left  } );
            _self.updateInput(_self);
            var year = _self.options.year;
            var month = _self.options.month;
            var day = _self.options.day;
            _self.container.html("");
            if(_self.options.type == "month"){
                _self.container.addClass('month-mode');
            }else{
                _self.container.removeClass('month-mode');
            }
            _self.container.append("<div class='nendai-spinner' id='nendai-year-spinner'><label>Year</label><a class='increment nendai-button' href='#'>+</a><div class='value'>" + year + "</div><a class='decrement nendai-button' href='#'>&#8722;</a></div>");
            _self.container.append("<div class='nendai-spinner' id='nendai-month-spinner'><label>Month</label><a class='increment nendai-button' href='#'>+</a><div class='value'>" + month + "</div><a class='decrement nendai-button' href='#'>&#8722;</a></div>");
            if(_self.options.type != "month")
                _self.container.append("<div class='nendai-spinner' id='nendai-day-spinner'><label>Day</label><a class='increment nendai-button' href='#'>+</a><div class='value'>" + day + "</div><a class='decrement nendai-button' href='#'>&#8722;</a></div>");
            _self.container.append("<div class='nendai-dialog-controls'><a class='accept nendai-button'>Accept</a><a class='cancel nendai-button'>Cancel</a></div>");
            //year
            _self.container.children("#nendai-year-spinner").children(".increment").click( function(e) { e.preventDefault(); _self.changeYear(_self,  1); });
            _self.container.children("#nendai-year-spinner").children(".decrement").click( function(e) { e.preventDefault(); _self.changeYear(_self,  -1); });
            //month
            _self.container.children("#nendai-month-spinner").children(".increment").click( function(e) { e.preventDefault(); _self.changeMonth(_self, 1); });
            _self.container.children("#nendai-month-spinner").children(".decrement").click( function(e) { e.preventDefault(); _self.changeMonth(_self, -1); });
            //day
            _self.container.children("#nendai-day-spinner").children(".increment").click( function(e) { e.preventDefault(); _self.changeDay(_self, 1); });
            _self.container.children("#nendai-day-spinner").children(".decrement").click( function(e) { e.preventDefault(); _self.changeDay(_self, -1); });
            //accept
            _self.container.find('.accept').click(function(){
                _self.storeDate(_self);
                _self.updateInput(_self);
                _self.clearCalendar(_self);
                _self.container.hide();
            });

            _self.container.find('.cancel').click( function(){
                _self.clearCalendar(_self);
                _self.container.hide();                
            });
        },

        clearCalendar: function(_self){
            _self.container.html("");
        },

        changeYear: function(_self, change){
            var year = _self.getSpinnerYear(_self) + change;
            _self.setSpinnerYear(_self, year);
        },
        changeMonth: function(_self, change){
            var month = _self.getSpinnerMonth(_self) + change;
            if(month > 12){
                month = 1;
                _self.changeYear(_self,1);
            }
            if(month < 1){
                month = 12;
                _self.changeYear(_self,-1);
            }
            var daysInMonth = new Date(_self.getSpinnerYear(_self),month,1,-1).getDate();
            if(daysInMonth < _self.getSpinnerDay(_self))
                _self.setSpinnerDay(_self,daysInMonth);
            _self.setSpinnerMonth(_self,month);
        },
        changeDay: function(_self, change){
            var day = _self.getSpinnerDay(_self) + change;
            var daysInMonth = new Date(_self.getSpinnerYear(_self),_self.getSpinnerMonth(_self),1,-1).getDate();
            if(day > daysInMonth){
                day = 1;
                _self.changeMonth(_self,1);
            }
            if(day < 1){
                _self.changeMonth(_self,-1);
                day = new Date(_self.getSpinnerYear(_self),_self.getSpinnerMonth(_self),1,-1).getDate();
            }
            _self.setSpinnerDay(_self,day);
        },

        storeDate: function(_self){
            _self.options.year = _self.getSpinnerYear(_self);
            _self.options.month = _self.getSpinnerMonth(_self);
            _self.options.day = _self.getSpinnerDay(_self);
        },

        getSpinnerYear: function(_self){
            return parseInt(_self.container.children("#nendai-year-spinner").children(".value").html());
        },
        getSpinnerMonth: function(_self){
            return parseInt(_self.container.children("#nendai-month-spinner").children(".value").html());
        },
        getSpinnerDay: function(_self){
            return parseInt(_self.container.children("#nendai-day-spinner").children(".value").html());
        },

        setSpinnerYear: function(_self, year){
            _self.container.children("#nendai-year-spinner").children(".value").html(year);
        },
        setSpinnerMonth: function(_self, month){
            _self.container.children("#nendai-month-spinner").children(".value").html(month);
        },
        setSpinnerDay: function(_self, day){
            _self.container.children("#nendai-day-spinner").children(".value").html(day);
        },

        updateInput: function(_self){
            if(_self.options.type == "month")
                $(_self.element).val(_self.options.year+"-"+_self.options.month);
            else
                $(_self.element).val(_self.options.year+"-"+_self.options.month+"-"+_self.options.day);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                var plugin = new Plugin( this, options );
                $.data(this, "plugin_" + pluginName,
                plugin);
            }
        });
    };

})( jQuery, window, document );