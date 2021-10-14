<template>
  <div class="w-100">
    <div class="d-n-XS w-100 fs-8-S fs-25-XS fw-600 f-white-200  pb-0-L pb-0-M pb-0-S pb-15-XS ta-l-S ta-c-XS">
        <Balance />
    </div>
    <AmDivider class="my-4-S my-10-XS" />
    <div class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 pb-2-S pb-10-XS fd-r ai-c pt-0 jc-l-S jc-c-XS">
      Rewards
      <Hint>
        ARP (Annual Percentage Rate) is just a simple interest that you will be receiving every year paid in the token of your choice. But the APR is subject to change and fluctuations.
        The “Monthly” and “Daily” are simply calculated to show how much you will be receiving at the term.
      </Hint>
    </div>
    <div class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-3-S pl-0 jc-l-S jc-c-XS pb-1-S pb-10-XS">
      <span class="f-mcolor-300 pr-2">{{getHgen}}</span> HGEN <span class="fs-5-S fs-20-XS pl-2">(<span class="f-mcolor-100">32.50%</span> APR)</span>
    </div>
    <div class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-3-S pl-0 jc-l-S jc-c-XS pb-1-S pb-10-XS">
      <span class="f-mcolor-300 pr-2">{{getHgen}}</span> HGEN <span class="fs-5-S fs-20-XS pl-2">(<span class="f-mcolor-100">32.50%</span> Monthly)</span>
    </div>
    <div class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-3-S pl-0 jc-l-S jc-c-XS pb-1-S pb-10-XS">
      <span class="f-mcolor-300 pr-2">{{getHgen}}</span> HGEN <span class="fs-5-S fs-20-XS pl-2">(<span class="f-mcolor-100">1.50%</span> Daily)</span>
    </div>
    <AmDivider class="my-4-S my-10-XS" />
    <div class="w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-5-S pb-15-XS ta-l-S ta-c-XS">
      Your current Farmings
    </div>
    <div class="w-100">
      
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-400 f-gray-500 fd-r ai-c">
          Farming Date
        </div>
        <div class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
         <span class="f-white-200 pl-1-S pl-5-XS">{{getNow}}</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-400 f-gray-500 fd-r ai-c">
          Redemption Date
        </div>
        <div class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
          <span class="f-white-200 pl-1-S pl-5-XS">{{getNow}}</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-400 f-gray-500 fd-r ai-c">
          Deposited SOL
        </div>
        <div class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
         0 <span class="f-white-200 pl-1-S pl-5-XS">GENS</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-400 f-gray-500 fd-r ai-c">
          Deposited HGEN
        </div>
        <div class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
         0 <span class="f-white-200 pl-1-S pl-5-XS">HGEN</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-400 f-gray-500 fd-r ai-c">
          Your Liquidity
        </div>
        <div class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
          (0<span class="f-white-200 pl-1-S pl-5-XS">%</span>)<span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS pl-1-S pl-5-XS">$</span>0 
        </div>
      </div>
       <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-400 f-gray-500 fd-r ai-c">
          Total Liquidity
        </div>
        <div class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
         <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span>0 
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-600 f-gray-500 fd-r ai-c">
         Current Earnings (<span class="f-mcolor-100 fw-600">SOL</span>)
        </div>
        <div class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
         <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span>0 
        </div>
      </div>
      

    </div>  
  </div>
</template>

<script>
import Hint from '@/components/Hint'
import Balance from '@/components/my/pool/Balance.vue'
 

export default {
  data: {
    timestamp: ""
  },
  components: {
    Hint,
    Balance
  },
  layout: 'my',
  computed: {
    getPercent () {
      return Number.parseInt((this.$accessor.pool.depositAmount / this.$accessor.totalDeposit || 0) * 100)
    },
    getCoin () {
      return this.$accessor.pool.rewardCoinAmount
    },
    getGens () {
      return this.$accessor.pool.rewardGensAmount
    },
    getHgen () {
      return this.$accessor.pool.rewardHgenAmount
    },
    getNow () {
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date +' '+ time;
        return dateTime;
    }
  }
}
</script>
