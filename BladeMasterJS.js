/**
 * 
 * @title BladeMaster.js
 * @description Welcome BladeMaster! BladeMasterJS is a JS class that enhances the CryptoBlades.io UX experience while also offering an edge to battle
 * 
 * @ver 2.2.2
 * @author: phoenixtools
 * @contributors: Hudson Atwell
 */
 
 var BladeMasterJS = {
    
    version: "2.2.2",
    disableAds : false,
    scriptsLoaded : false,
    weaponStatsClone : {},
	balances : {},
	marketPrices : {},
	traitMap : {},
	character : {},
	weapon : {},
	enemies: {},
	currentFeeScope : "today",
	currentBattleScope : "today",
	coinGecko : {},
	gameStats : {},
	intervals : {},
	listeners : {},

	init : function() {
		
		this.loadMetaMaskListers();
		this.loadBattleHistory();
		this.loadHeader();
		this.loadWeb3();
		
		setTimeout(function(bm) {
			if (!window.ethereum.selectedAddress) {
				return true;
			}
			bm.loadPrices();
		} , 600 , this );
		
		this.intervals.listeners = setInterval(function( bm ) {
			bm.loadListeners();
		}, 500 , this )
		
		if(this.disableAds) {
			document.querySelector('.adsbygoogle').style.display = "none";
			document.querySelector('.google-auto-placed').style.display = "none";
		}
		
	}
	
	,
	
	destroyCurrentInstance : function() {
		
		/* remove header */
		document.querySelector('.BladeMasterJS').parentNode.removeChild(document.querySelector('.BladeMasterJS'));
			
		/* destroy all current intervals */
		for (key in BladeMasterJS.intervals) {
			clearInterval(BladeMasterJS.intervals[key])
		}
		
		/* set select BladeMasterJS data back to default */
		this.balances = {}
		this.marketPrices = {}
		this.character = {}
		this.weapon = {}
		this.enemies = {}
		this.currentFeeScope = "today"
		this.intervals = {}
		this.listeners = {}
		
		
	}
	
	,
	
	loadMetaMaskListers : function() {
		
		/* on acount change */
		window.ethereum.on('accountsChanged', function (accounts) {

			
			/* Destroy BladeMaserJS instance */
			BladeMasterJS.destroyCurrentInstance()
			
			/* Rebuild BladeMasterJS instance */
			setTimeout(function() {
				BladeMasterJS.init();
			}, 1000 )
			
		})
	}
	
	,
	
	loadListeners : function() {
		
		/**
		 *Listen for BNB tip 
		 */
		if (document.querySelector('.bnb-tip') && !BladeMasterJS.listeners.bnbTip) {
			
			BladeMasterJS.listeners.bnbTip = true;
			
			/* listen for TIP BNB event */
			document.querySelector('.bnb-tip').addEventListener('click', function() {
				BladeMasterJS.listeners.bnbTip = true;
				
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
		
		/**
		 * Listen for SKILL tip (not active at the moment)
		 */ 
		if (document.querySelector('.skill-tip') && !BladeMasterJS.listeners.skillTip) {

			BladeMasterJS.listeners.skillTip = true;
				
			/* listen for TIP SKILL event */
			document.querySelector('.skill-tip').addEventListener('click', function() {
				
			})
			
		}
		
		
		/**
		 * Listen for Fight Stats reveal
		 */ 
		if (document.querySelector('.bnb-show-fight') && !BladeMasterJS.listeners.showFights) {

			BladeMasterJS.listeners.showFights = true;
			BladeMasterJS.listeners.row2 = false;
				
			document.querySelector('.bnb-show-fight').addEventListener('click', function() {
				var fightHistory = document.querySelector('.fight-history');
				var row1 = document.querySelector('.stats-row-1');
				var row2 = document.querySelector('.stats-row-2');
				
				
				if (fightHistory.style.display == "none") {
					fightHistory.style.display = "block";
					fightHistory.style.height = "100vh";
				}
				else if (!BladeMasterJS.listeners.row2) {
					row2.style.display = "flex"
					BladeMasterJS.listeners.row2 = true;
				}
				else if (row2.style.display == "flex") {
					fightHistory.style.height = "210px";
					row2.style.display = "none"
				} else {
					fightHistory.style.display = "none";
					BladeMasterJS.listeners.row2 = false;
				}
			
			})
			
		}
		
		
		/**
		 * Listen for fee range cycle clicks 
		 */
		if (document.querySelector('.cycle-fee-scope-forward')  && !BladeMasterJS.listeners.feeScopeForward) {
			
			
			BladeMasterJS.listeners.feeScopeForward = true;
			
			/* listen for TIP SKILL event */
			document.querySelector('.cycle-fee-scope-forward').addEventListener('click', function() {
				
				document.querySelectorAll(".fee-bnb").forEach( function(feeContainer) {
					feeContainer.style.display = "none";
				})
						
				switch(BladeMasterJS.currentFeeScope) {
					case "today":
						BladeMasterJS.currentFeeScope = "week";
						break;
					case "week":
						BladeMasterJS.currentFeeScope = "month";
						break;
					case "month":
						BladeMasterJS.currentFeeScope = "today";
						break;	
				}
				
				
				document.querySelector("#fee-bnb-contatiner-" + BladeMasterJS.currentFeeScope ).style.display = "inline-block";
			
			} )
		}
		
		
		/**
		 * listen for battle results 
		 */
		if (!BladeMasterJS.listeners.battleResults && !document.querySelector('#fightResultsModal') ) {
			
			BladeMasterJS.listeners.battleResults = true;
			
			this.intervals.battleResults = setInterval(function() {
				
				if (!document.querySelector('#fightResultsModal'))
				{
					return;
				}
				
				
				/* Destroy BladeMaserJS instance */
				BladeMasterJS.destroyCurrentInstance()
	
				/* Rebuild BladeMasterJS instance */
				setTimeout(function() {
					BladeMasterJS.init();
				}, 1000 )
				
				
			}, 500  );
			
		}
		
		/**
		 * Cycle the fight stats forward
		 */
		if (document.querySelector('.cycle-fight-stats-forward')  && !BladeMasterJS.listeners.battleScopeForward) {
			
			
			BladeMasterJS.listeners.battleScopeForward = true;
			
			/* listen for TIP SKILL event */
			document.querySelector('.cycle-fight-stats-forward').addEventListener('click', function() {
				
				switch(BladeMasterJS.currentBattleScope) {
					case "today":
						BladeMasterJS.currentBattleScope = "week";
						document.querySelector('.cylce-fight-label').innerText = "LAST 7 DAYS"
						break;
					case "week":
						BladeMasterJS.currentBattleScope = "month";
						document.querySelector('.cylce-fight-label').innerText = "LAST 31 DAYS"
						break;
					case "month":
						BladeMasterJS.currentBattleScope = "all";
						document.querySelector('.cylce-fight-label').innerText = "1000 FIGHTS"
						break;	
					case "all":
						BladeMasterJS.currentBattleScope = "today";
						document.querySelector('.cylce-fight-label').innerText = "LAST 24 HOURS"
						break;	
				}
				
				
				/* replce all the statistics */
				BladeMasterJS.loadFightHistoryStats(BladeMasterJS.currentBattleScope)
			
			} )
		}
		
		
		/**
		 * Cycle the fight stats backwards
		 */
		if (document.querySelector('.cycle-fight-stats-backward')  && !BladeMasterJS.listeners.battleScopeBackward) {
			
			
			BladeMasterJS.listeners.battleScopeBackward = true;
			
			/* listen for TIP SKILL event */
			document.querySelector('.cycle-fight-stats-backward').addEventListener('click', function() {
				
				switch(BladeMasterJS.currentBattleScope) {
					case "today":
						BladeMasterJS.currentBattleScope = "all";
						document.querySelector('.cylce-fight-label').innerText = "1000 FIGHTS"
						break;
					case "week":
						BladeMasterJS.currentBattleScope = "today";
						document.querySelector('.cylce-fight-label').innerText = "LAST 24 HOURS"
						break;
					case "month":
						BladeMasterJS.currentBattleScope = "week";
						document.querySelector('.cylce-fight-label').innerText = "LAST 7 DAYS"
						break;	
					case "all":
						BladeMasterJS.currentBattleScope = "month";
						document.querySelector('.cylce-fight-label').innerText = "LAST 31 DAYS"
						break;	
				}
				
				
				/* replce all the statistics */
				BladeMasterJS.loadFightHistoryStats(BladeMasterJS.currentBattleScope)
			
			} )
		}
			
	
		
		/**
		 * Listen for mouse hovers over weapon in battle mode
		 */
		if (document.querySelector('.weapon-icon')) {
			
			/* make sure that manual weapon mouseovers always renews the battlestats */
			document.querySelector('.weapon-icon').addEventListener('mouseenter', function() {
					
					setTimeout(function() {
						BladeMasterJS.checkIfBattlePage();
						BladeMasterJS.loadCharacter();
						BladeMasterJS.loadWeapon();
						BladeMasterJS.loadEnemies();
						BladeMasterJS.calculateBattle();
					}, 300)
					
					if (BladeMasterJS.intervals.calculateBattle) {
						return;
					}
					

					BladeMasterJS.intervals.calculateBattle = setInterval(function() {
						
						BladeMasterJS.loadCharacter();
						BladeMasterJS.loadWeapon();
						BladeMasterJS.loadEnemies();
						BladeMasterJS.calculateBattle();
						
					} , 700 );
				
				
			} , {once :true} )
			
			/* make sure that manual weapon mouseovers always renews the battlestats */
			document.querySelector('.weapon-icon').addEventListener('mouseleave', function() {
					clearInterval(BladeMasterJS.intervals.calculateBattle);
					BladeMasterJS.intervals.calculateBattle = 0;
			} , {once :true} )
			
			
		}
		
		
		
	}
	
	,
	
	loadWeb3 : function() {
		
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
		
		if (document.querySelector('.BladeMasterJS')) {
			return;
		}
		
		var headerElement= document.createElement('div');
		
		var htmlTemplate = ''
		+ '<div class="BladeMasterJS" style="">'
	
		+ '<div class="bm-col-1">'
		+ '		BladeMasterJS '
		
		+ '		<span class="header-separator"> | </span>'
		
		+ '		<b>$BNB</b> <span class="bnb-price" title="Market price of BNB in USD"></span>  <span class="bnb-balance" style="color:lightgreen"></span>'
		
		+ '		<span class="header-separator"> | </span>'
		
		+ '		<b>$SKILL</b> <span class="skill-price" title="Market price of SKILL in USD"></span>'
		
		+ '	</div>'
		
		+ ' <div  class="bm-col-2">'
		
		+ '		<div class="skill-ballance-container" style="display:inline-block;">'
		+ '			<b>SKILL</b>:  <span class="skill-balance-skill" style="color:gold"></span>  <span class="skill-balance-usd" style="color:lightgreen"></span>  <span class="skill-balance-bnb" style="color:lightgreen"></span>'
		+ '			<span class="header-separator"> | </span>'
		+ '     </div>'
		

		+ '		<div class="bnb-ballance-container" style="display:inline-block;">'
		+ '			<b>BNB</b>:  <span class="bnb-balance-bnb" style="color:lightblue"></span>  <span class="bnb-balance-usd" style="color:lightgreen"></span>  <span class="bnb-balance-skill" style="color:lightgreen"></span>'
		
		+ '			<span class="header-separator"> | </span>'
		+ '     </div>'
		
		
		+ '		<div class="fees-container" style="display:inline-block;">'
		+ '			<b>FEES</b>:  '
		
		//+ '		<span class="cycle-fee-scope-back" style=""><img src="/img/earning-potential-sword.753769a3.png" class="sword-right" style="width:25px;transform: scaleX(-1);margin-left: 10px;    margin-right: -3px;    margin-left: 2px;"></span>'
		
		+ ' 		<span class="fee-label fee-bnb" id="fee-bnb-contatiner-today" style="color:mintcream;"><span class="fee-bnb-today" style="color:lightblue"></span><span class="fee-usd-today" style="color:LIGHTSALMON"></span> <span style="font-size: 10px;margin-left: 3px;">LAST 24 HOURS</span> </span>'
		
		+ '     	<span class="fee-labe fee-bnb" id="fee-bnb-contatiner-week" style="color:mintcream;display:none;"><span class="fee-bnb-week" style="color:lightblue"></span><span class="fee-usd-week" style="color:LIGHTSALMON"></span> <span style="font-size: 10px;margin-left: 3px;">LAST 7 DAYS</span> </span>'
		
		+ '     	<span class="fee-label fee-bnb" id="fee-bnb-contatiner-month" style="color:mintcream;display:none"><span class="fee-bnb-month" style="color:lightblue"></span><span class="fee-usd-month" style="color:LIGHTSALMON"></span><span style="font-size: 10px;margin-left: 3px;"> LAST 31 DAYS</span> </span> '
		
		+ '		<span class="cycle-fee-scope-forward" ><img src="/img/earning-potential-sword.753769a3.png" class="sword-left" style="width:25px;margin-left: 3px;    margin-left: -2px;cursor:pointer;"></span>'
		
		+ '     <span class="header-separator"> | </span>'
		+ '		</div>'
		
		+ '		<div class="bnb-tip-container" style="display:none;">'
		+ '     <a class="bnb-tip"  href="#tip-blademaster-dev"  title="Send a Tip to the BladeMasterJS Developemnt Team!"><b>TIP <span class="recommended-bnb-tip">.01</span> BNB</b></a>'
		+ '     <span class="header-separator"> | </span>'
		+ '		</div>'
		
		+ '		<div class="bnb-free-trial-counter" style="display:none;" title="Days remaining in the free BladeMasterJS trial.">'
		+ '     <b> <span class="dono-days-remaining"></span></b>'
		+ '     <span class="header-separator"> | </span>'
		+ '		</div>'
		
		+ '		<div class="bnb-show-fight" style="display:inline-block;cursor:pointer;" title="Toggle Fight History">'
		+ '     📅'
		+ '		</div>'
				
		+ '		<div class="prompt-update" style="display:none;" title="A new version of BladeMasterJS is available now!">'
		+ '     <span class="header-separator"> | </span>'
		+ '     <b><a href="https://github.com/phoenix-tools/BladeMasterJS/blob/master/BladeMasterJS.js" target="_blank" style="color:lightgreen !important;">UPDATE AVAILABLE!</a></b>'
		+ '		</div>'
		+ '</div>'
		+ '</div>'
		
		+ '<style>'
		+ '	.header-separator {'
		+'  	margin:7px;'
		+'	}'
		+'	.BladeMasterJS {'
		+'		background-color: '
		+'		darkslategray;'
		+'		color: #fff;'
		+'		text-align: end;'
		+'		padding-right:7px; '
		+'		padding-top:6px; '
		+'		padding-bottom:3px; '
		+'		display:flex;'
		+'		justify-content:space-between;'
		+'		flex-wrap: wrap;font-size: 12px;'
		+'	}'
		
		+' </style>';
		
		headerElement.innerHTML = htmlTemplate;
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(headerElement, firstChild);
		
	}
	
	,
	
	loadBattleHistory : function() {
		
		if (document.querySelector('.stats--container')) {
			return;
		}
		
		var battleHistoryElement= document.createElement('div');
		
		var htmlTemplate = ''

    	+ '	<div class="fight-history" style="display:none;height:100vh">'
    	+ '		<div style="color: #f6f6f6;margin-left: auto;margin-right: auto;width: 100%;text-align: center;margin-top: 16px;background-color:rebeccapurple;">'
    	+ '			<span class="cycle-fight-stats-backward">'
    	+ '				<img src="/img/earning-potential-sword.753769a3.png" class="sword-right" style="transform: scaleX(-1);width:65px;margin-left: 3px;margin-left:-2px;cursor:pointer;">'
    	+ '			</span>'
    	+ '			<span class="cylce-fight-label" style="width: 139px; display: inline-block;">'
    	+ ' 			LAST 24 HOURS'
    	+ ' 		</span>'
    	+ '			<span class="cycle-fight-stats-forward">'
    	+ '				<img src="/img/earning-potential-sword.753769a3.png" class="sword-left" style="width:65px;margin-left: 3px;margin-left: -2px;cursor:pointer;">'
    	+ '			</span>'
    	+ '		</div>'
    
		+ '    <div class="stats--container  stats-row-1" style="">'
		+ '      <div class="stat--container">'
		+ '        <div class="stat--label">BATTLES</div>'
		+ '            <div class="stat--value stat-battles">0</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '            <div class="stat--label">WINS</div>'
		+ '           <div class="stat--value stat-wins">0</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '           <div class="stat--label">LOSSES</div>'
		+ '            <div class="stat--value stat-losses" >0</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '            <div class="stat--label">SKILL EARNED</div>'
		+ '            <div class="stat--value stat-tokens" style="color:gold;">.0</div>'
		+ '        </div>'
		+ '       <div class="stat--container">'
		+ '            <div class="stat--label">FEES BNB</div>'
		+ '            <div class="stat--value stat-fees">.00 BNB</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '            <div class="stat--label">~PROFIT</div>'
		+ '            <div class="stat--value stat-profit"  style="color:lightgreen;">$0</div>'
		+ '        </div>'
		+ '    </div>'
		
		+ '    <div class="stats--container stats-row-2" style=" display:none;">'
		+ '      <div class="stat--container">'
		+ '        <div class="stat--label">WIN PERCENTAGE</div>'
		+ '            <div class="stat--value stat-win-percentage">0</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '            <div class="stat--label">AVERAGE SKILL</div>'
		+ '           <div class="stat--value stat-average-skill" style="color:gold">0</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '            <div class="stat--label">AVERAGE FEE</div>'
		+ '           <div class="stat--value stat-average-fee">0</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '            <div class="stat--label">AVERAGE PROFIT</div>'
		+ '           <div class="stat--value stat-average-profit">0</div>'
		+ '        </div>'
		+ '    </div>'
		
		
		+ '</div>'
		+ '    <style>'
		+ '        .stats--container {'
		+ '            display:flex;'
		+ '            justify-content:space-evenly;'
		+ '            align-items: center;'
		+ '            width:100%;'
		+ '            color: #eedba5;'
		+ '            margin-top: 20px;'
		+ '            margin-bottom: 20px;'
		+ '        }'

		+ '        .stat--container {'
		+ '           width:15%;'
		+ '        }'
		
		+ '        .stat--label {'
		+ '            line-height: 6vmin;'
		+ '            border-radius: 2px 2px 0 0;'
		+ '            background-color: #323f53;'
		+ '            border-bottom: 1px solid #253246;'
		+ '            box-shadow: 0 1px 0 #495b71 inset;'
		+ '            white-space: pre;'
		+ '            width:100%;'
		+ '            text-align: center;'
		+ '            padding-top:10px;'
		+ '            padding-bottom:8px;'
		+ '            font-weight:900;'
		+ '        }'

		+ '        .stat--value {'
		+ '            background-color: #2b3847;'
		+ '            width: 100%;'
		+ '            text-align: center;'
		+ '            color: #d1d1d1;'
		+ '            padding-top: 20px;'
		+ '            padding-bottom: 33px;'
		+ '            font-size: 22px;'
		+ '        }'
		+ '    </style>';
		
		battleHistoryElement.innerHTML = htmlTemplate;
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(battleHistoryElement, firstChild);
		
	}
	
	,
	
	
	loadPrices : function() {
		
		if (this.marketPrices.bnb ) {
			return;
		}
		
		/* get user SKILL balance, does not include staked SKILL */
		this.balances.skill = document.querySelector('.balance').innerText.replace(' SKILL' , "").trim();
		
		/* load BNB and SKILL prices from Coingecko API */
		var coingeckoRequest = new XMLHttpRequest();
			
		var params = {
            vs_currency: "usd",
            ids: "binancecoin,cryptoblades"
        }
        
        var apiURL = new URL("https://api.coingecko.com/api/v3/coins/markets");
        
        for (const key in params ) {
        	apiURL.searchParams.append(key , params[key]);
        }
        
                
		coingeckoRequest.open("GET", apiURL.href );
		coingeckoRequest.send();
		
		coingeckoRequest.onload = () => {
	
			BladeMasterJS.coinGecko  = JSON.parse(coingeckoRequest.response);

			BladeMasterJS.marketPrices.bnb = BladeMasterJS.coinGecko[0].current_price;
			BladeMasterJS.marketPrices.skill = BladeMasterJS.coinGecko[1].current_price;
			
			/* figure out skill balance */
			BladeMasterJS.balances.usd_skill =  ( parseFloat(BladeMasterJS.balances.skill , 8 ) * parseFloat(BladeMasterJS.marketPrices.skill , 8 ) ).toFixed(2);
			
			BladeMasterJS.balances.bnb_skill =  ( parseFloat(BladeMasterJS.balances.usd_skill , 8 ) / parseFloat(BladeMasterJS.marketPrices.bnb , 8 ) ).toFixed(4);
			
			
			/* set these prices into the header */
			document.querySelector('.bnb-price').innerText = "" + BladeMasterJS.marketPrices.bnb +" "
			document.querySelector('.skill-price').innerText = "" + BladeMasterJS.marketPrices.skill + " "
			document.querySelector('.skill-balance-skill').innerText =  BladeMasterJS.balances.skill + " SKILL  "
			document.querySelector('.skill-balance-usd').innerText = " +$" + BladeMasterJS.balances.usd_skill + " "
			document.querySelector('.skill-balance-bnb').innerText = " +" + BladeMasterJS.balances.bnb_skill + "BNB "
			
			
			/* load BNB Balance and Calculate Transactions from Custom API */
			var bscscanRequest = new XMLHttpRequest();
				
			var params = {
	            ethAddress: window.ethereum.selectedAddress.toLowerCase(),
	            clientDateTime: new Date().getTime(),
	            clientTimeZoneOffset: new Date().getTimezoneOffset(),
	            product: "blademasterjs",
	            query: ["bnbBalance","txFees","fights"]
	        }
	        
	        apiURL = new URL("https://phoenixtools.io/api/gamestats/");
	        
	        for (const key in params ) {
	        	apiURL.searchParams.append(key , params[key]);
	        }
	        
	                
			bscscanRequest.open("GET", apiURL.href );
			bscscanRequest.send();
			
			bscscanRequest.onload = () => {
		
				BladeMasterJS.gameStats  = JSON.parse(bscscanRequest.response);
				
				if (!BladeMasterJS.gameStats.dono.isDono && !BladeMasterJS.gameStats.isWhiteListed && BladeMasterJS.gameStats.trial.status != "active") {
					
					document.querySelector('.bnb-tip-container').style.display = "inline-block";
					
					document.querySelector('.BladeMasterJS').style.justifyContent = "flex-end";
					document.querySelector('.bm-col-1').style.width = "90%";
					
					document.querySelector('.bm-col-1').innerHTML = '<div class="dono-activate-promot" style="display: contents;padding-right:10px;width:100%;"><marquee>YOOOOO! You\'re free 14 day trial has ended! -------- Aw man! -------- <b>BladeMasterJS</b> costs <span style="color:gold"><b>.01 BNB</b></span> for every <b>40 days</b> of use. --------  Click the <b>TIP</b> button to the right to activate your copy!  --------  Make sure your <b>MetaMask</b> is set to the <b>Binance Smart Chain</b> before tipping!  -------- There might be a delay between tipping and asset activation depending on the speed of the bscscan.com API. If activation takes longer than an hour then please reach out on our <a href="https://discord.gg/6AjVj3s9aN" target="_blank">Discord</a> for manual assistance :) </marquee></div>';
					document.querySelector('.skill-ballance-container').parentNode.removeChild(document.querySelector('.skill-ballance-container'))
					document.querySelector('.bnb-ballance-container').parentNode.removeChild(document.querySelector('.bnb-ballance-container'))
					document.querySelector('.fees-container').parentNode.removeChild(document.querySelector('.fees-container'))
					return;
				}
				
				else if (BladeMasterJS.gameStats.dono.isDono || BladeMasterJS.gameStats.isWhiteListed) {
					document.querySelector('.bnb-tip').title = "You have " + BladeMasterJS.gameStats.dono.daysRemaining + " days until the next donation.";
					document.querySelector('.bnb-tip-container').style.display = "inline-block";
				}	
				else if (BladeMasterJS.gameStats.trial.status == "active") {
					document.querySelector('.bnb-free-trial-counter').style.display = "inline-block";
					document.querySelector('.dono-days-remaining').innerText = BladeMasterJS.gameStats.trial.daysRemaining + " Days ";
				}
				
				
				BladeMasterJS.balances.bnb = parseFloat(BladeMasterJS.gameStats.balances.bnb.inETH).toFixed(4);
				
				/* figure out dollar balance */
				BladeMasterJS.balances.usd_bnb =  ( parseFloat(BladeMasterJS.balances.bnb , 8 ) * parseFloat(BladeMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
				
				BladeMasterJS.balances.skill_bnb =  ( parseFloat(BladeMasterJS.balances.usd_bnb , 8 ) / parseFloat(BladeMasterJS.marketPrices.skill , 8 ) ).toFixed(4);
				
				
				/* set these prices into the header */
				document.querySelector('.bnb-balance-bnb').innerText =  BladeMasterJS.balances.bnb + " BNB  "
				document.querySelector('.bnb-balance-usd').innerText = " +$" + BladeMasterJS.balances.usd_bnb + " "
				document.querySelector('.bnb-balance-skill').innerText = " +" + BladeMasterJS.balances.skill_bnb + "SKILL "
				
				/* calculate fee bnb cost in USD */
				var feesTodayUSD = BladeMasterJS.gameStats.txFees.today * BladeMasterJS.marketPrices.bnb;
				var feesWeekUSD = BladeMasterJS.gameStats.txFees.thisWeek * BladeMasterJS.marketPrices.bnb;
				var feesMonthUSD = BladeMasterJS.gameStats.txFees.thisMonth * BladeMasterJS.marketPrices.bnb;
				
				/* add day fees to UI */
				document.querySelector('.fee-bnb-today').innerText = parseFloat(BladeMasterJS.gameStats.txFees.today).toFixed(4) + " BNB "
				document.querySelector('.fee-usd-today').innerText = " ($"+ parseFloat(feesTodayUSD).toFixed(3) + ") "
				
				/* add week fees to UI */
				document.querySelector('.fee-bnb-week').innerText =  parseFloat(BladeMasterJS.gameStats.txFees.thisWeek).toFixed(4) + " BNB "
				document.querySelector('.fee-usd-week').innerText =  " ($"+ parseFloat(feesWeekUSD).toFixed(3) + ") "
				
				/* add month fees to UI */
				document.querySelector('.fee-bnb-month').innerText =  parseFloat(BladeMasterJS.gameStats.txFees.thisMonth).toFixed(4) + " BNB "
				document.querySelector('.fee-usd-month').innerText =   " ($"+ parseFloat(feesMonthUSD).toFixed(3) + ") "
				
				/* Calculate Fight History Stats */
				BladeMasterJS.loadFightHistoryStats(BladeMasterJS.currentBattleScope)
			};
		
		};

	}
	
	,
	
	/**
	 *
	 */
	loadFightHistoryStats: function( period ) {

		document.querySelector('.stat-battles').innerText = BladeMasterJS.gameStats.fights[period].totalFights;
		document.querySelector('.stat-wins').innerText = BladeMasterJS.gameStats.fights[period].wins;
		document.querySelector('.stat-losses').innerText = BladeMasterJS.gameStats.fights[period].losses;
		
		/* calculate profit */
		/* get market value of tokens */
		var marketTokens = BladeMasterJS.marketPrices.skill * BladeMasterJS.gameStats.fights[period].tokenGains;
		document.querySelector('.stat-tokens').innerText = BladeMasterJS.gameStats.fights[period].tokenGains.toFixed(3) + ' ($' + marketTokens.toFixed(2) +')';

		
		/* get market value of fees */
		var marketBNB = BladeMasterJS.marketPrices.bnb * BladeMasterJS.gameStats.fights[period].fees;
		document.querySelector('.stat-fees').innerText = BladeMasterJS.gameStats.fights[period].fees.toFixed(3) + ' ($' + marketBNB.toFixed(2) +')';
		
		/* subtract the two for profit */
		var profit = marketTokens - marketBNB;
		
		if (profit < 0 ) {
			document.querySelector('.stat-profit').style.color = "tomato"; 
			document.querySelector('.stat-profit').innerText = '-$' + profit.toFixed(2).replace('-','');
		} else {
			document.querySelector('.stat-profit').style.color = "lightgreen";
			document.querySelector('.stat-profit').innerText = '$' + profit.toFixed(2);
		}
		
		/* get win percentage */
		if (!BladeMasterJS.gameStats.fights[period].totalFights) {
			document.querySelector('.stat-win-percentage').innerText = "0%"; 
		} else {
			var winPercentage =  ( BladeMasterJS.gameStats.fights[period].wins / BladeMasterJS.gameStats.fights[period].totalFights ) * 100;
			document.querySelector('.stat-win-percentage').innerText = winPercentage.toFixed(0) + "%";
		}
		
		/* get average SKILL */
		if (!BladeMasterJS.gameStats.fights[period].tokenGains) {
			document.querySelector('.stat-average-skill').innerText = "0"; 
		} else {
			var averageTokenGains =  ( BladeMasterJS.gameStats.fights[period].tokenGains / BladeMasterJS.gameStats.fights[period].totalFights )
			var marketAverageTokenGains = BladeMasterJS.marketPrices.skill * averageTokenGains;
			document.querySelector('.stat-average-skill').innerText = averageTokenGains.toFixed(4) + ' ($'+marketAverageTokenGains.toFixed(2)+')';
		}
		
		/* get average fee */
		if (!BladeMasterJS.gameStats.fights[period].fees) {
			document.querySelector('.stat-average-fee').innerText = "0"; 
		} else {
			var averageFees =  ( BladeMasterJS.gameStats.fights[period].fees / BladeMasterJS.gameStats.fights[period].totalFights )
			var marketAverageFees = BladeMasterJS.marketPrices.bnb * averageFees;
			document.querySelector('.stat-average-fee').innerText = averageFees.toFixed(4) + ' ($'+marketAverageFees.toFixed(2)+')';
		}
		
		/* get average profit */
		if (!profit) {
			document.querySelector('.stat-average-profit').innerText = "0"; 
		} else {
			var averageProfit =  ( profit / BladeMasterJS.gameStats.fights[period].totalFights )

			
			if (averageProfit < 0 ) {
				document.querySelector('.stat-average-profit').innerText = '-$' + averageProfit.toFixed(2).replace('-','');
				document.querySelector('.stat-average-profit').style.color = "tomato"; 
			} else {
				document.querySelector('.stat-average-profit').innerText = '$' + averageProfit.toFixed(2)
				document.querySelector('.stat-average-profit').style.color = "lightgreen"; 
			}
		}
	}
	,
	
	/**
	 *
	 */
	checkIfBattlePage : function() {
		
		var currentPage = window.location.href.replace(window.location.origin + '/#/' , '');
		
		var isCombatPage = true;
		
		if (currentPage != 'combat') {
			isCombatPage = false;
		}
		
		if(document.querySelectorAll('.encounter-container').length <1 ) {
			isCombatPage = false;
		}
		
		
		if (isCombatPage) {
			
			document.querySelectorAll('.victory-chance').forEach(function( box ) {
				box.style.position = "relative"
				box.style.marginBottom = "-44px"
			});
		}
		
		return isCombatPage;
		
	}
	
	,
	
	/**
	 *
	 */
	getElementCode : function(element) {
		
		BladeMasterJS.traitMap.earth = 0
		BladeMasterJS.traitMap.lightning = 1
		BladeMasterJS.traitMap.water = 2
		BladeMasterJS.traitMap.fire = 3
		BladeMasterJS.traitMap.power = 4
		
		return BladeMasterJS.traitMap[element.toLowerCase().trim()];
	}
	
	,
	
	/**
	 *
	 */
	getAttrElement : function( attr ) {
			switch(element.toUpperCase()) {
			case "DEX":
				return 0;
				break;
			case "CHA":
				return 1;
				break;
			case "INT":
				return 2;
				break;
			case "STR":
				return 3;
				break;
			case "PWR":
				return 4;
				break;
		}
	}
	
	,
	
	/**
	 *
	 */
	loadCharacter : function() {
		
		this.character.name = document.querySelector(".character-data-column .name").innerText;
		
		this.character.element = this.getElementCode(document.querySelector(".character-data-column .trait-icon")._prevClass.replace("-icon trait-icon" , ""));
		
		this.character.power = parseInt(document.querySelector(".character-data-column .subtext-stats").children[3].innerText.replace("," , ""))
		
	}
	
	,
	
	/**
	 *
	 */
	loadWeapon : function() {
		
		this.weapon.name = document.querySelector('.weapon-selection .name').innerText;
		
		this.weapon.element = this.getElementCode(document.querySelector('.weapon-selection .trait').children[0].className.replace("-icon" , ""));
		
		this.getWeaponAttributes(this.weapon.name);
		
	}
	
	,
	
	/**
	 * 
	 */ 
	getWeaponAttributes : function( name ) {
		
		
		
		/* set defaults */
		this.weapon.stat = []; 
		this.weapon.bonusPower = 0; 
		
		this.weapon.stat[1] = {
			element : 1,
			power : 0
		}
		
		this.weapon.stat[2] = {
			element : 1,
			power : 0
		} 
		
		this.weapon.stat[3] = {
			element : 1,
			power : 0
		} 
		
		/* if no weapon tooltip is detected then bail */
		var toolTipInner = document.querySelector('.tooltip-inner');
		if(!toolTipInner || !toolTipInner.innerText) {
			return;
		}
		
		//var correctToolTip = {};
		//document.querySelectorAll('.tooltip-inner').forEach(function(element) {
			//
		//})

		this.weapon.statsRaw = toolTipInner.innerText;
		
		/* parse raw text by new line */
		this.weapon.statsParsed = this.weapon.statsRaw.split(/\r?\n/);
		
		
		if (this.weapon.statsParsed.length < 1 ) {
			return;
		}

		var count = 1;
		for ( lineItem of this.weapon.statsParsed ) {
			//
			var traitParts = lineItem.split(":")
			
			if (typeof(traitParts[1]) == "undefined") {
				continue; 
			}
			
			if (!traitParts[1].match(/\d+/)) {
				continue; 
			}
			
			
			
			switch (traitParts[0]) {
				case "★":
				case "★★":
				case "★★★":
				case "★★★★":
				case "★★★★★":
				case "ID":
				case "LB":
				case "4B":
					continue
					break;
				case "INT" :
					this.weapon.stat[count].element = this.getElementCode("water");
					break;
				case "STR":
					this.weapon.stat[count].element = this.getElementCode("fire");
					break;
				case "CHA":
					this.weapon.stat[count].element = this.getElementCode("lightning");
					break;
				case "DEX":
					this.weapon.stat[count].element = this.getElementCode("earth");
					break;
				case "PWR":
					this.weapon.stat[count].element = this.getElementCode("power");
					break;
				case "Bonus power":
					this.weapon.bonusPower = this.weapon.bonusPower +  parseInt(traitParts[1].match(/\d+/).pop().trim());
					
					continue;
					break;
					
			}
			
			
			
			BladeMasterJS.weapon.stat[count].power = parseInt(traitParts[1].match(/\d+/).pop().trim());
			
			count++;
			
		}
	

	}
	
	,
	
	/**
	 * 
	 */
	loadEnemies : function() {
		
		BladeMasterJS.enemies = BladeMasterJS.enemies ? BladeMasterJS.enemies : []
		
		var enemyContainers = document.querySelectorAll('.encounter-container');

		/* loop through containers and build enemy profiles */
		count = 1;
		enemyContainers.forEach( function(enemy) {
			
			/* add % containers into enemy cards if they do not exist yet */
			if (!enemy.querySelector('.enemy'+count+'Chance')) {
				enemy.querySelector('.victory-chance').innerHTML = enemy.querySelector('.victory-chance').innerHTML + "<div class='enemy"+count+"Chance'></div>";
			}
			
			/* create enemy profile */
			BladeMasterJS.enemies[count] = {}
			
			BladeMasterJS.enemies[count].element = BladeMasterJS.getElementCode(enemy.querySelector('.encounter-element').children[0].className.replace('-icon' , ''));
			//
			BladeMasterJS.enemies[count].power = parseInt(enemy.querySelector('.encounter-power').innerText.replace(" Power " , "" )); 
			
			count++;
		});
	}
	
	,
	
	checkForUpdates : function() {
	
		var gitHubRequest = new XMLHttpRequest();
        var apiURL = new URL("https://api.github.com/repos/phoenix-tools/BladeMasterJS/tags");
        
        
		gitHubRequest.open("GET", apiURL.href );
		gitHubRequest.send();
		
		gitHubRequest.onload = () => {
			BladeMasterJS.gitHub  = JSON.parse(gitHubRequest.response);
			var latestRelease = BladeMasterJS.gitHub[0];
			var latestVersion = latestRelease.name
			
			var updateReady = BladeMasterJS.version.localeCompare(latestVersion, undefined, { numeric: true, sensitivity: 'base' })  
			
			/*
			console.log( BladeMasterJS.version)
			console.log(latestVersion)
			console.log(updateReady)
			*/
			
			if (updateReady < 0 ){
				document.querySelector('.prompt-update').style.display ="inline-block"
			}
		}
	}
	
	, 
	/**
	 *
	 * 
	 */
	calculateBattle : function() {
		
	    /* if no weapon tooltip is detected then bail */
		if(!this.weapon.stat[1].power && !this.weapon.bonusPower) {
			
			return;
		}
		

		if (!document.querySelector('.encounter-container')) {
			return;
		}
		
	 	function t(t, a, e) {
	        let i = 1;
	        var r, n;
	        return t == a && (i += .075),
	        n = e,
	        ((r = t) == BladeMasterJS.traitMap.fire && n == BladeMasterJS.traitMap.earth || r == BladeMasterJS.traitMap.water && n == BladeMasterJS.traitMap.fire || r == BladeMasterJS.traitMap.lightning  && n == BladeMasterJS.traitMap.water || r == BladeMasterJS.traitMap.earth && n == BladeMasterJS.traitMap.lightning) && (i += .075),
	        function(t, a) {
	            return t == BladeMasterJS.traitMap.fire && a == BladeMasterJS.traitMap.water || t == BladeMasterJS.traitMap.water && a == BladeMasterJS.traitMap.lightning || t == BladeMasterJS.traitMap.lightning && a == BladeMasterJS.traitMap.earth || t == BladeMasterJS.traitMap.earth && a == BladeMasterJS.traitMap.fire
	        }(t, e) && (i -= .075),
	        i
	    }
	    function a(t, a) {
	        return t = Math.ceil(t),
	        a = Math.floor(a),
	        Math.floor(Math.random() * (a - t + 1)) + t
	    }
	 	
        let e = parseInt(BladeMasterJS.character.element)
          , i = parseInt(BladeMasterJS.weapon.element)
          , r = parseInt(BladeMasterJS.weapon.stat[1].element)
          , n = parseInt(BladeMasterJS.weapon.stat[2].element)
          , o = parseInt(BladeMasterJS.weapon.stat[3].element)
          , s = parseInt(BladeMasterJS.enemies[1].element)
          , p = parseInt(BladeMasterJS.enemies[2].element)
          , c = parseInt(BladeMasterJS.enemies[3].element)
          , d = parseInt(BladeMasterJS.enemies[4].element);
        !function(e, i, r, n, o, s, p, c, d, l, h, T, w, u, g, f, v, k) {
            let m, b, I = function(t, a, e, i, r, n, o) {
                let s = 1;
                a > 0 && e >= 0 && (s += e == t ? .0026750000000000003 * a : e == BladeMasterJS.traitMap.power ? .002575 * a : .0025 * a);
                i > 0 && r >= 0 && (s += r == t ? .0026750000000000003 * i : r == BladeMasterJS.traitMap.power ? .002575 * i : .0025 * i);
                n > 0 && o >= 0 && (s += o == t ? .0026750000000000003 * n : o == BladeMasterJS.traitMap.power ? .002575 * n : .0025 * n);
                return s
            }(n, o, s, p, c, d, l), y = e * I + r, x = Math.ceil(h - .1 * h), M = Math.floor(h + .1 * h), W = Math.ceil(y - .1 * y), P = Math.floor(y + .1 * y), F = Math.ceil(w - .1 * w), E = Math.floor(w + .1 * w), C = Math.ceil(y - .1 * y), L = Math.floor(y + .1 * y), R = Math.ceil(g - .1 * g), B = Math.floor(g + .1 * g), H = Math.ceil(y - .1 * y), N = Math.floor(y + .1 * y), D = Math.ceil(v - .1 * v), A = Math.floor(v + .1 * v), G = Math.ceil(y - .1 * y), J = Math.floor(y + .1 * y), O = t(i, n, T), S = t(i, n, u), U = t(i, n, f), _ = t(i, n, k), j = 0, q = 0, z = 0, K = 0;
            for (let t = 0; t < 500; t++)
                m = a(W, P) * O,
                b = a(x, M),
                m >= b && j++,
                m = a(C, L) * S,
                b = a(F, E),
                m >= b && q++,
                m = a(H, N) * U,
                b = a(R, B),
                m >= b && z++,
                m = a(G, J) * _,
                b = a(D, A),
                m >= b && K++;
                
		
                
            document.querySelector(".enemy1Chance").innerText = (j / 500 * 100).toFixed(2) + " %",
            document.querySelector(".enemy2Chance").innerText = (q / 500 * 100).toFixed(2) + " %",
            document.querySelector(".enemy3Chance").innerText = (z / 500 * 100).toFixed(2) + " %",
            document.querySelector(".enemy4Chance").innerText = (K / 500 * 100).toFixed(2) + " %"
            
        }( BladeMasterJS.character.power, e, BladeMasterJS.weapon.bonusPower, i, BladeMasterJS.weapon.stat[1].power, r, BladeMasterJS.weapon.stat[2].power, n, BladeMasterJS.weapon.stat[3].power, o, BladeMasterJS.enemies[1].power, s, BladeMasterJS.enemies[2].power, p, BladeMasterJS.enemies[3].power, c, BladeMasterJS.enemies[4].power, d)
    
	}

}

setTimeout(function() {
	
	/* prevent delay on first run */
	BladeMasterJS.init();
	BladeMasterJS.checkForUpdates();
	
} , 3500 )