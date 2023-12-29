<template>
  <div class="sec-card">
    <div class="sec-card__wrapper container">
      <ul class="sec-card__artist">
        <li
          class="sec-card__artist-item"
          v-for="(item, key) in card.items"
          :key="key"
        >
          <figure
            v-if="
              !item.item_html &
              !item.item_html2 &
              !item.item_html3 &
              !item.item_html4
            "
            class="sec-card__artist-item-img"
          >
            <a :href="item.item_url" target="_blank">
              <img :src="item.item_image" />
            </a>
          </figure>
          <figure v-if="item.item_html" class="sec-card__artist-item-img">
            <img
              src="https://raibbithole.s3.ap-northeast-1.amazonaws.com/NEEDS_food_DAY.png"
              @click="toggleImages"
              :class="{ hide: isImage2Shown }"
            />
            <img
              src="https://raibbithole.s3.ap-northeast-1.amazonaws.com/NEEDS_food_NIGHT.png"
              @click="toggleImages"
              :class="{ hide: isImage1Shown }"
            />
          </figure>
          <figure v-if="item.item_html2" class="sec-card__artist-item-img">
            <img
              src="https://raibbithole.s3.ap-northeast-1.amazonaws.com/NEEDS_room-DAY.png"
              @click="toggleImages2"
              :class="{ hide: isImage4Shown }"
            />
            <img
              src="https://raibbithole.s3.ap-northeast-1.amazonaws.com/NEEDS_room-NIGHT.png"
              @click="toggleImages2"
              :class="{ hide: isImage3Shown }"
            />
          </figure>
          <figure v-if="item.item_html3" class="sec-card__artist-item-img">
            <img
              src="https://raibbithole.s3.ap-northeast-1.amazonaws.com/NEEDS_Inner_The_world_in_your_head_1.png"
              @click="toggleImages3"
              :class="{ hide: isImage6Shown }"
            />
            <img
              src="https://raibbithole.s3.ap-northeast-1.amazonaws.com/NEEDS_Inner_The_world_in_your_head_2.png"
              @click="toggleImages3"
              :class="{ hide: isImage5Shown }"
            />
          </figure>
          <figure v-if="item.item_html4" class="sec-card__artist-item-img">
            <img
              src="https://raibbithole.s3.ap-northeast-1.amazonaws.com/NEEDS_connect_cute.png"
              @click="toggleImages4"
              :class="{ hide: isImage8Shown }"
            />
            <img
              src="https://raibbithole.s3.ap-northeast-1.amazonaws.com/NEEDS_connect.png"
              @click="toggleImages4"
              :class="{ hide: isImage7Shown }"
            />
          </figure>
          <div class="sec-card__artist-item-content">
            <h4 class="sec-card__artist-item-content-name">
              {{ item.item_name }}
            </h4>
            <div class="sec-card__artist-item-content-creator">
              {{ item.item_creator }}
            </div>

            <div class="sec-card__artist-item-content-purchase">
              <div
                class="sec-card__artist-item-content-purchase-price header__nav-btn gray"
              >
                <i class="icon">$</i>
                <p>{{ item.item_price }}</p>
                <i>B</i>
              </div>
              <div
                v-if="
                  (wallet.status != 'connected') |
                    !marketplaceConfig.status |
                    (marketplaceConfig.balance < item.item_price)
                "
                class="sec-card__artist-item-content-purchase-pur notConnected header__nav-btn gray"
                @click="notifyToCheckWallet(item)"
              >
                PURCHASE
              </div>
              <div
                v-if="
                  (wallet.status === 'connected') &
                  marketplaceConfig.status &
                  (marketplaceConfig.balance >= item.item_price)
                "
                class="sec-card__artist-item-content-purchase-pur header__nav-btn gray"
                @click="clickPurchase(item)"
              >
                PURCHASE
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <pop v-if="showPop" @update="closePop()" />
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, reactive } from "@vue/reactivity";
import { watch, inject } from "@vue/runtime-core";
import Pop from "../pop.vue";
import {
  useMulticall,
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
  useEthersHooks,
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
  VueDapp,
} from "vue-dapp";
import { ethers } from "ethers";
import { Interface } from "@ethersproject/abi";
import BFFMarketplaceAbi from "/src/abi/BFFMarketplace.json";
import BFFAbi from "/src/abi/BFF.json";
import { useLoading } from "vue-loading-overlay";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { i18n } from "@/main.js";

const { wallet, disconnect, onDisconnect, onAccountsChanged, onChainChanged } =
  useWallet();
const { address, balance, chainId, isActivated } = useEthers();
const { onActivated, onChanged, onDeactivated } = useEthersHooks();

const { locale, t } = useI18n({
  inheritLocale: true,
});

const switchLang = () => {
  if (i18n.global.locale.value === "en") {
    i18n.global.locale.value = "zh-TW";
  } else {
    i18n.global.locale.value = "en";
  }
};

const card = ref({});
const showPop = ref(false);
const isDisabled = ref(true);

// Init Loader
const $loading = useLoading();
const fullPage = ref(true);
const onCancel = () => console.log("User cancelled the loader.");

// Blockchain Services
const infuraId = "27a789b5b3154631a5dc5c3a61c789bb";
const openseaAPIKey = "b443520a48ed4704bd46ead51059a05a";

// contract addr : mainnet
const chainIdToUse = 137;
const BFFAddress = "0x7711F4c00B5A1Ef1E328089e021160e4765f6cF7";
const marketplaceAddress = "0x7cE66b940B566fE7CAFAECf5009aAF3553580e7b";
const openseaURL = ref("https://opensea.io/zh-TW/assets/matic/");

// contract addr : testnet
// const chainIdToUse = 80001;
// const BFFAddress = "0xB80ae96b55379A82Fa9AABee850C6683D6157533";
// const marketplaceAddress = "0xd0b62655d7095AF74868E2bAe7679Ab9a4e819d9";

let providerActivated = inject("providerActivated");
let signerActivated = inject("signerActivated");

const marketplaceConfig = inject("marketplaceConfig");
const selectedChainId = inject("selectedChainId");
const isChainChanged = inject("isChainChanged");
const switchError = inject("switchError");

const apiEnpoint = "https://api.raibbithole.xyz/gallery";

axios
  .get(apiEnpoint)
  .then((res) => {
    console.log(res.data);
    card.value = res.data;
    setTimeout(() => {
      window.$scroll.update();
    }, 1000);

    // return {
    //     card
    // }
  })
  .catch((err) => {
    console.log(err);
  });

console.log("card", card);

// html modification
const isImage1Shown = ref(true);
const isImage2Shown = ref(false);
const toggleImages = () => {
  isImage1Shown.value = !isImage1Shown.value;
  isImage2Shown.value = !isImage2Shown.value;
};

const isImage3Shown = ref(true);
const isImage4Shown = ref(false);
const toggleImages2 = () => {
  isImage3Shown.value = !isImage3Shown.value;
  isImage4Shown.value = !isImage4Shown.value;
};

const isImage5Shown = ref(true);
const isImage6Shown = ref(false);
const toggleImages3 = () => {
  isImage5Shown.value = !isImage5Shown.value;
  isImage6Shown.value = !isImage6Shown.value;
};

const isImage7Shown = ref(true);
const isImage8Shown = ref(false);
const toggleImages4 = () => {
  isImage7Shown.value = !isImage7Shown.value;
  isImage8Shown.value = !isImage8Shown.value;
};

// ------ dapp Function Implementation --------
// Event hooks
// onActivated(async ({ provider, address, signer }) => {
//   console.log("onActivated: ", provider, address, signer);

//   // Display Loading bar
//   let loader = $loading.show({
//     container: fullPage ? null : this.$refs.formContainer,
//     canCancel: true,
//     onCancel: onCancel,
//   });

//   selectedChainId.value = chainId.value;
//   providerActivated = provider;
//   signerActivated = signer;

//   // Check for balance of BFF
//   await displayBalanceOfBFF();

//   loader.hide();
// });

// onDisconnect(() => {
//   // reset status
//   marketplaceConfig.value = { status: null, balance: 0 };

//   console.log("disconnect");
// });
// onDeactivated(() => {
//   // reset status
//   marketplaceConfig.value = { status: null, balance: 0 };

//   console.log("disconnect");
// });

// onAccountsChanged(async () => {
//   console.log("onAccountsChanged");

//   // Display Loading bar
//   let loader = $loading.show({
//     container: fullPage ? null : this.$refs.formContainer,
//     canCancel: true,
//     onCancel: onCancel,
//   });

//   // reset status
//   marketplaceConfig.value = { status: null, balance: 0 };

//   // Check for balance of BFF
//   await displayBalanceOfBFF();

//   loader.hide();
// });
// onChainChanged(async (chainId) => {
//   console.log("onChainChanged");

//   // Display Loading bar
//   let loader = $loading.show({
//     container: fullPage ? null : this.$refs.formContainer,
//     canCancel: true,
//     onCancel: onCancel,
//   });

//   selectedChainId.value = chainId;
//   isChainChanged.value = true;

//   // reset status
//   marketplaceConfig.value = { status: null, balance: 0 };

//   // Check for money bag qualification
//   if (isActivated.value) {
//     await displayBalanceOfBFF();
//   }

//   loader.hide();
// });
// onChanged(async ({ provider, signer }) => {
//   console.log("onChanged");
//   // Display Loading bar
//   let loader = $loading.show({
//     container: fullPage ? null : this.$refs.formContainer,
//     canCancel: true,
//     onCancel: onCancel,
//   });

//   selectedChainId.value = chainId.value;
//   isChainChanged.value = true;
//   providerActivated = provider;
//   signerActivated = signer;

//   // reset status
//   marketplaceConfig.value = { status: null, balance: 0 };

//   // Check for money bag qualification
//   if (isActivated.value) {
//     await displayBalanceOfBFF();
//   }

//   loader.hide();
// });

// Notify when purchase butoon is diable
async function notifyToCheckWallet(item) {
  let error_msg = "";
  if (wallet.status != "connected") {
    error_msg = "Please Connect Wallet before making purchase.";
  } else if (!marketplaceConfig.value.status) {
    error_msg =
      "Please approve $BFF by clicking 'Approve' on the top right corner";
  } else {
    error_msg = "you have insufficient $BFF for making purchase";
  }
  notify({
    group: "dapp",
    type: "error",
    text: error_msg,
  });
}

// Send Transction Functions
// tx handle functions
async function handleTransaction(transaction) {
  let tx;

  const awaitTransaction = async (trans) => {
    let tx;
    try {
      tx = await trans.wait(1);
    } catch (error) {
      const e = error;
      // @see https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse
      if ((e.reason == "replaced" || e.reason == "repriced") && e.replacement) {
        tx = await awaitTransaction(e.replacement);
      } else if (e.reason == "cancelled") {
        throw new Error("Transaction cancelled");
      } else {
        throw new Error(e.reason || e?.toString());
      }
    }
    return tx;
  };

  tx = await awaitTransaction(transaction);

  return tx;
}

// purchase item with marketplace contract
async function clickPurchase(item) {
  console.log(
    "purchase token:",
    item.item_token_id,
    "with price:",
    item.item_price
  );

  // Display Loading bar
  let loader = $loading.show({
    container: fullPage ? null : this.$refs.formContainer,
    canCancel: true,
    onCancel: onCancel,
  });

  // Init Contract
  const MarketplaceContract = new ethers.Contract(
    marketplaceAddress,
    BFFMarketplaceAbi.abi,
    signerActivated.value
  );

  // Check whether enough balance for minting
  if (marketplaceConfig.value["balance"] < item.item_price) {
    loader.hide();
    notify({
      group: "dapp",
      type: "error",
      text: t("marketplace.BFFNotEnough"),
    });
    return;
  }

  // Send Mint TX
  console.log(ethers.utils.parseEther(item.item_price.toString(), "wei"));
  let mintTx;
  try {
    mintTx = await MarketplaceContract.mintItem(
      item.item_token_id,
      1,
      ethers.utils.parseEther(item.item_price.toString(), "wei")
    );
  } catch (e) {
    loader.hide();
    if (e.code == "ACTION_REJECTED") {
      // User refused transaction.
      console.error(e);
      notify({
        group: "dapp",
        type: "error",
        text: t("dapp.userDeclineTransaction"),
      });
      return;
    } else if (e.code == "UNPREDICTABLE_GAS_LIMIT") {
      console.error(e);
      notify({
        group: "dapp",
        type: "error",
        text: t("marketplace.revertByContract"),
      });
      return;
    } else {
      console.error(e);
      return;
    }
  }

  // Show up waiting for tx completed notice
  notify({
    group: "moneyBag",
    type: "info",
    title: t("marketplace.waitingForTXResult"),
    duration: 7000,
  });

  // Handle TX Response
  let receipt;
  try {
    receipt = await handleTransaction(mintTx);
    console.log(`mintTx:${receipt.transactionHash}`, receipt);

    // update balance
    marketplaceConfig.value["balance"] -= item.item_price;

    // update item detail
    marketplaceConfig.value["tokenID"] = item.item_token_id;

    // show notification about suucess in case of devices not getting any messages
    notify({
      group: "moneyBag",
      type: "success",
      title: item.item_name + " Minted!",
      text:
        "You have minted " +
        item.item_name +
        "(token ID:" +
        item.item_token_id +
        ") with price:" +
        item.item_price +
        " B",
      duration: 10000,
    });

    // display modal about minted NFT
    showPop.value = true;
  } catch (e) {
    console.error(e);
    loader.hide();
    notify({
      group: "dapp",
      type: "error",
      text: t("marketplace.approveTxFailed"),
    });
    return;
  }

  // hide loading bar when tx finished
  loader.hide();
}

const closePop = () => {
  showPop.value = false;
};
</script>

<style lang="scss">
$class-name: sec-card;
.#{$class-name} {
  @include size(100vw, auto);

  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 10vh 0;

  @include media-breakpoint-down(tablet) {
    padding: 10vh 0;
    align-items: flex-start;
    min-height: auto;
  }

  &__title {
    @include typo("heading", 1);

    margin-bottom: 72px;
    color: map-get($colors, brown);
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__artist {
    @include set-col(10, 12, 0);

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    @include media-breakpoint-down(tablet) {
      @include size(calc(100% - 40px), auto);

      justify-content: space-between;
    }

    &-item {
      @include size(30%, auto);

      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 48px;
      border-radius: 24px;
      overflow: hidden;

      @include media-breakpoint-down(desktop) {
        @include size(calc(50% - 12px), auto);
      }

      @include media-breakpoint-down(tablet) {
        @include size(calc(100%), auto);
      }

      &:hover {
        .#{$class-name}__artist-item-img {
          transform: scale(1.1);
        }
      }

      > div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      &-img {
        @include size(100%, auto);

        object-fit: cover;
        margin-bottom: 16px;
        overflow: hidden;
        transition: transform 0.3s;

        @include media-breakpoint-down(tablet) {
          border-radius: 48px;
        }

        img {
          @include size(100%);
        }
      }

      &-content {
        width: 100%;
        padding: 1rem;
        background-color: map-get($colors, white);

        &-name {
          @include typo("heading", 3);

          color: map-get($colors, grays);
          font-size: 28px;
          line-height: 1.1;

          @include media-breakpoint-down(desktop) {
            font-size: 28px;
            font-weight: 800;
            line-height: 1;
          }
        }

        &-creator {
          color: map-get($colors, grays);
          font-weight: 500;
          opacity: 0.5;
          margin: 0 0 0 0.2rem;
          @include media-breakpoint-down(desktop) {
            font-size: 16px;
          }
        }

        &-purchase {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin: 0.6rem 0 0;

          &-price {
            display: flex;
            align-items: flex-end;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

            i {
              font-size: 0.65rem;
              line-height: 1.8;

              @include media-breakpoint-down(desktop) {
                font-size: 0.6rem;
                line-height: 2.2;
              }

              &.icon {
                line-height: 3.2;

                @include media-breakpoint-down(desktop) {
                  line-height: 3.6;
                }
              }
            }

            p {
              font-size: 20px;
              font-weight: 600;
              padding: 0 0.4rem 0 0.1rem;
              line-height: 2;

              @include media-breakpoint-down(desktop) {
                font-size: 20px;
              }
            }
          }

          &-pur {
            color: white;
            font-weight: 500;
            display: flex;
            align-items: center;
            cursor: pointer;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

            @include media-breakpoint-down(desktop) {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

.notConnected {
  color: grey !important;
}
/* --------@popup-------- */
.esNotification {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  &.out {
    opacity: 0;
    pointer-events: none;
  }

  .inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    padding: 2rem;
    background-color: map-get($colors, white);
    border-radius: 24px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    pointer-events: all;

    @include media-breakpoint-down(tablet) {
      width: 80%;
    }

    i {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      color: map-get($colors, grays);
    }

    img {
      width: 5rem;
      height: 5rem;
    }

    h4 {
      font-size: 40px;
      font-weight: 800;
      color: map-get($colors, grays);
      text-align: center;
    }

    p {
      font-size: 20px;
      font-weight: 500;
      color: map-get($colors, grays);
      opacity: 0.5;
      text-align: center;
    }
  }
}

.hide {
  display: none;
}
</style>
