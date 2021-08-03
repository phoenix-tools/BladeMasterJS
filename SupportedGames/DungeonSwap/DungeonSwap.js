/**
 * 
 * @title dungeonmaster.js
 * @description Welcome dungeonmaster! DungeonMasterJS is a JS class that enhances the dungeonswap.app UX experience while also offering an edge to battle
 * 
 * @ver 1.0
 * @author: phoenixtools
 * @contributors: Hudson Atwell
 */
 
 var DungeonMasterJS = {
    
    scriptsLoaded : false,
	balances : {},
	marketPrices : {},
	traitMap : {},
	character : {},
	weapon : {},
	enemies: {},
	
	init : function() {
		DungeonMasterJS.load();
	}
	,

	renew : function() {
		DungeonMasterJS.load();
	}
	
	,
	/**
	 *
	 */
	load: function() {
		
	
		this.loadHeader();
		this.loadListeners();
		this.loadPrices();

		if(this.checkIfBattlePage()) {
			
		}
		
	
		
	}, 
	
	loadScripts : function() {
		
		if (this.scriptsLoaded) {
			return;
		}
		
		var jq = document.createElement('script');
	    jq.type = 'text/javascript';
	    jq.async = true;
	    jq.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.5.0/web3.min.js';
	    var s = document.body.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(jq, s);
	    
	    this.scriptsLoaded = true;
	}
	
	,

	loadHeader : function() {
		
		if (document.querySelector('.DungeonMasterJS')) {
			return;
		}
		
		document.querySelector('nav').style = "top:21px;"
		
		var headerElement= document.createElement('div');
		
		headerElement.innerHTML = '<div class="DungeonMasterJS" style="background-color: darkslategray;color: #fff;text-align: end;padding-right:7px;position:fixed; background-color:rgb(39, 38, 44);width:100vw;z-index:100;font-family: system-ui;">DungeonMasterJS <span class="header-separator"> | </span> <b>BNB</b> <span class="bnb-price"></span><span class="header-separator"> | </span>  <b>DND</b> <span class="skill-price"></span>  <span class="skill-balance" style="color:lightgreen"></span>  <span class="header-separator"> | </span> <a class="bnb-tip"  href="#tip-dungeonmaster-dev"  title="Send a Tip to the DungeonMasterJS Developemnt Team!">TIP <span class="recommended-bnb-tip">.01</span> <b>BNB</b>  </a> <span class="header-separator"></div><style>.header-separator {margin:7px;}</style>'
		
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(headerElement, firstChild);
		
		
		
	}
	
	,
	
	
	loadListeners : function() {
		
		/* make sure element exitst before adding listener */
		if (document.querySelector('.bnb-tip')) {
			
			/* listen for TIP BNB event */
			document.querySelector('.bnb-tip').addEventListener('click', function() {
			
				  var transactionHash = window.ethereum.request({
				    method: 'eth_sendTransaction',
				    params: [
				      {
				        to: '0x2D6371DB3C7f3B1D44A7613e5Dc9dd49C740eC2A',
				        from: window.ethereum.selectedAddress,
				        value: Web3.utils.toHex(Web3.utils.toWei("0.01")),
				      },
				    ],
				  });
			} , {once :true} )
			
		}
		
		
	}
	
	,
	
	loadPrices : function() {
		
		return;
		
		if (this.marketPrices.bnb) {
			return;
		}
		
		/* get BNB */
		let request = new XMLHttpRequest();
		var apiRequestData = {
		    "symbol": "BNB,DND",
		};
		
		request.open("POST", "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest");
		request.setRequestHeader("X-CMC_PRO_API_KEY", "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c");
		request.setRequestHeader("Access-Control-Allow-Origin", "*");
		request.send(apiRequestData);
		
		request.onload = () => {
		    console.log(request);
		    
		    if (request.status === 200) {
		      console.log(JSON.parse(request.response));
		    } else {
		      console.log(`error ${request.status} ${request.statusText}`);
		    }
		    
		};
	
	
	}
	
	,
	
	/**
	 *
	 */
	checkIfBattlePage : function() {
		
		
	}
}

setTimeout(function() {
	setInterval(function() {

		/* Start Routine Checks */
		DungeonMasterJS.renew();
		
	} , 10000 );
	
	/* prevent delay on first run */
	DungeonMasterJS.init();
	
	/* annouce to console that DungeonMasterJS is loaded */
	console.log('DungeonMasterJS loaded');
} , 2000 )



