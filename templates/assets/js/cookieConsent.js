(function (window, document, $) { // in private anonymous namespace, $ maps to jQuery

    const identificator = 'cookieConsent';
	let currentPreferences = null;
	let showDialog = false;

    // general function to set cookie value
    function setCookie(cname, cookieValue, expires) {
		document.cookie = cname + '=' + encodeURIComponent(cookieValue) + expires + '; path=/';
	}
	
    // general function to get cookie value
	function getCookie(cname) {
	    let name = cname + "=";
	    let decodedCookie = decodeURIComponent(document.cookie);
	    let ca = decodedCookie.split(';');
	    
		for (let c of ca) {
			let cookieStr = c;
			while (cookieStr.startsWith(' ')) {
				cookieStr = cookieStr.substring(1);
			}
			if (cookieStr.startsWith(name)) {
				return cookieStr.substring(name.length, cookieStr.length);
			}
		}
	    return "";
	}

    function hideCookieDialog() {
		$('.cookieDialog').css('display','none');
		$('.cookieOverlay').hide();
	}

    function showCookieDialog() {
		$('.cookieDialog').css('display','table');
		$('.cookieOverlay').show();
	}

    // creates timestamp and save cookie preferences to cookies
    // runs GTM consent update 
    // triggers custom GTM event 'consentFormSubmit'
    // hides dialog
    function saveCookiePreferences(preferences) {
        let now = new Date();
		let cookieValue = preferences + '&consentTimestamp=' + now.toGMTString();
		let expires = getExpiresValues();

        setCookie(identificator, cookieValue, expires);
        runScripts();
        triggerGTMEvent('consentFormSubmit');
        hideCookieDialog();
    }

	function getExpiresValues() {
		let expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
		return '; expires=' + expirationDate.toGMTString();
	}

    // run GTM consent update based on current consent settings
    function runScripts() {
		if (currentPreferences != null) {
	    	if (currentPreferences["marketing"] == 1) {
				gtag('consent', 'update', {
							'ad_storage': 'granted',
                            'ad_personalization': 'granted',
							'analytics_storage': 'granted',
							'personalization_storage': 'granted'});
			} else if (currentPreferences["marketing"] == 0) {
				gtag('consent', 'update', {
							'ad_storage': 'denied',
                            'ad_personalization': 'denied',
							'analytics_storage': 'denied',
							'personalization_storage': 'denied'});
                }
		}
	}

    // push GTM event to data layer
    function triggerGTMEvent(eventName) {
        window.dataLayer.push({
			'event' : eventName
		});
    }

    function initCookieDialog() {
        // hide on overlay or close click
		$('.cookieDialog, .cookieOverlay, .cookieClose').on('click', function(e) {
			savePreferences();
			hideCookieDialog();
			e.preventDefault();
		});
		// dont do anything if clicking on dialog content
		$('.cookieBox').on('click', function(e) {
			e.stopPropagation();
		});

        // show cookie dialog when clicking on element with class showCookieDialog
        // so user can change his saved preferences
        // preloads form with current consent
        $('.showCookieDialog').on('click', function(e) {
            loadData();
			showCookieDialog();
			e.preventDefault();
		});
		
        // accept all - sets all cookies to be allowed
		// YOU CAN ADD MORE COOKIE TYPES HERE IF NECESSARY
		$('#coookieDialog_acceptAll_button').on('click', function(e) {
			currentPreferences = {'necessary': 1, 'marketing': 1};
			let preferences = 'preferences=' + JSON.stringify(currentPreferences);

			saveCookiePreferences(preferences);
			e.preventDefault();
		});
		
        // save preferences - saves cookie consent based on submitted form
		// YOU CAN ADD MORE COOKIE TYPES HERE IF NECESSARY
		$('#coookieDialog_save_button').on('click', function(e) {
			savePreferences();
			e.preventDefault();
		});

		// save preferences function
		function savePreferences() {
			let marketingConsent = $('#marketingCookiesConsent_input').is(':checked') ? 1 : 0;
			currentPreferences = {'necessary': 1, 'marketing': marketingConsent};
			let preferences = 'preferences=' + JSON.stringify(currentPreferences);

			saveCookiePreferences(preferences);
		}
	}

    // load saved cookie consent and preset form
    function loadData() {
		let params = getCookie(identificator).split("&");
		// go though cookie value params and find preferences
		for (let param of params) {
			let name_value = param.split("=");
			
			if (name_value[0] == "preferences") {
				currentPreferences = JSON.parse(name_value[1]);
			}
		}
	    
		setCookieConsentForm()
	    
	}

	// set checkbox values in form based on user preferences
	// YOU CAN ADD MORE COOKIE TYPES HERE IF NECESSARY
	function setCookieConsentForm() {
		// set marketing consent to false as default if there are no cookie preferences
		if (currentPreferences == null) {
			showDialog = true;
			$('#marketingCookiesConsent_input').prop('checked', true);
		// otherwise set marketing cookie consent checkbox value based on the user preferences
		} else if (currentPreferences["marketing"] == 1) {
			$('#marketingCookiesConsent_input').prop('checked', true);
		} else {
			$('#marketingCookiesConsent_input').prop('checked', false);
		}
	}

    function init() {
        loadData();
		initCookieDialog();
		
		if(showDialog) {
			showCookieDialog();
		} else {
			runScripts();
		}
	}
	
	init();

})(window, window.document, jQuery); // end of private namespace
