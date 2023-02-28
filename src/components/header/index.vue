<template>
  <header class="header" :class="{ '-active': showHeader }">
    <div class="header__wrapper container">
      <img
        class="header__logo"
        src="@/assets/logo.png"
        alt=""
        @click="scrollTo('hero')"
      />
      <p>RAIbbit Hole</p>
      <div class="header__nav">
        <a href="https://raibbithole.xyz/" class="header__nav-btn"> Home </a>
        <!-- <a href="" class="header__nav-btn yellow" @click.prevent="disableBtn">
          Connect Wallet
        </a> -->
        <button
          @click="isActivated ? disconnect() : open()"
          class="btn"
          :disabled="wallet.status === 'connecting'"
        >
          {{
            wallet.status === "connected"
              ? "Disconnect"
              : wallet.status === "connecting"
              ? "Connecting..."
              : wallet.status === "loading"
              ? "Loading..."
              : "Connect Wallet"
          }}
        </button>
        <vd-board
          :connectors="connectors"
          :connectErrorHandler="connectErrorHandler"
          dark
        >
        </vd-board>
        <div v-if="wallet.status === 'connected'" class="header__nav">
          $ {{ marketplaceConfig.balance }}
        </div>
        <a
          v-if="
            (wallet.status === 'connected') & (marketplaceConfig.status != true)
          "
          href="#card"
          class="header__nav-btn yellow"
          @click="approveBFFForMarketPlace()"
        >
          Approve
        </a>
      </div>
    </div>
  </header>
</template>
<script setup>
import { watch, inject } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
import { i18n } from "@/main.js";
import { nextTick, onMounted, ref } from "@vue/runtime-core";
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
import BFFAbi from "/src/abi/BFF.json";
import { useLoading } from "vue-loading-overlay";
import { notify } from "@kyvg/vue3-notification";

const { locale, t } = useI18n({
  inheritLocale: true,
});

const showHeader = ref(true);
const showMenu = ref(false);

const switchLang = () => {
  if (i18n.global.locale.value === "en") {
    i18n.global.locale.value = "zh-TW";
  } else {
    i18n.global.locale.value = "en";
  }
};

const scrollTo = (id) => {
  console.log(window.$scroll);
  window.$scroll.scrollTo("#" + id);
};

const disableBtn = (event) => {
  event.target.className += " disabled";
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

onMounted(() => {
  nextTick(() => {
    // window.$scroll.on('scroll', () => {
    //     if (window.$scroll.scroll.instance.scroll.y > 0) {
    //         showHeader.value = true
    //     } else {
    //         showHeader.value = false
    //     }
    // })
  });
});

// Init Loader
const $loading = useLoading();
const fullPage = ref(true);
const onCancel = () => console.log("User cancelled the loader.");

// ------------- Dapp Setting ----------------
// 1. Dapp/Blockchain network Config
const { open } = useBoard();
const { wallet, disconnect, onDisconnect, onAccountsChanged, onChainChanged } =
  useWallet();
const { address, balance, chainId, isActivated } = useEthers();
const { onActivated, onChanged, onDeactivated } = useEthersHooks();
const { availableNetworks } = useEthers();
const supportedChainId = Object.keys(availableNetworks.value).map((key) =>
  Number(key)
);
console.log(supportedChainId);

// Blockchain Services
const infuraId = "27a789b5b3154631a5dc5c3a61c789bb";
const openseaAPIKey = "b443520a48ed4704bd46ead51059a05a";

// contract addr : mainnet
// const chainIdToUse = 137;
// const BFFAddress = "0x0cCDe8834f16035bb116cDC17aF024df508E5A6D";
// const marketplaceAddress = "";

// contract addr : testnet
const chainIdToUse = 80001;
const BFFAddress = "0xB80ae96b55379A82Fa9AABee850C6683D6157533";
const marketplaceAddress = "0xd0b62655d7095AF74868E2bAe7679Ab9a4e819d9";

let providerActivated = inject("providerActivated");
let signerActivated = inject("signerActivated");

const connectors = [
  new MetaMaskConnector({
    appUrl: "http://localhost:3000",
  }),
  new WalletConnectConnector({
    qrcode: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${infuraId}`,
      5: `https://goerli.infura.io/v3/${infuraId}`,
      137: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      80001: `https://mumbai.infura.io/v3/${infuraId}`,
    },
  }),
];

// ------ dapp Function Implementation --------
const marketplaceConfig = inject("marketplaceConfig");
const selectedChainId = inject("selectedChainId");
const isChainChanged = inject("isChainChanged");
const switchError = inject("switchError");

// Event hooks
onActivated(async ({ provider, address, signer }) => {
  console.log("onActivated: ", provider, address, signer);

  // Display Loading bar
  let loader = $loading.show({
    container: fullPage ? null : this.$refs.formContainer,
    canCancel: true,
    onCancel: onCancel,
  });

  selectedChainId.value = chainId.value;
  providerActivated.value = provider;
  signerActivated.value = signer;

  // Check for balance of BFF
  if (chainIdToUse === selectedChainId.value) {
    await displayBalanceOfBFF();
  }

  loader.hide();
});

onDisconnect(() => {
  // reset status
  marketplaceConfig.value = { status: null, balance: 0 };

  console.log("disconnect");
});
onDeactivated(() => {
  // reset status
  marketplaceConfig.value = { status: null, balance: 0 };

  console.log("disconnect");
});

onAccountsChanged(async () => {
  console.log("onAccountsChanged");

  // Display Loading bar
  let loader = $loading.show({
    container: fullPage ? null : this.$refs.formContainer,
    canCancel: true,
    onCancel: onCancel,
  });

  // reset status
  marketplaceConfig.value = { status: null, balance: 0 };

  // Check for balance of BFF
  await displayBalanceOfBFF();

  loader.hide();
});
onChainChanged(async (chainId) => {
  console.log("onChainChanged");

  // Display Loading bar
  let loader = $loading.show({
    container: fullPage ? null : this.$refs.formContainer,
    canCancel: true,
    onCancel: onCancel,
  });

  selectedChainId.value = chainId;
  isChainChanged.value = true;

  // reset status
  marketplaceConfig.value = { status: null, balance: 0 };

  // Check for money bag qualification
  if (isActivated.value) {
    await displayBalanceOfBFF();
  }

  loader.hide();
});
onChanged(async ({ provider, signer }) => {
  console.log("onChanged");
  // Display Loading bar
  let loader = $loading.show({
    container: fullPage ? null : this.$refs.formContainer,
    canCancel: true,
    onCancel: onCancel,
  });

  selectedChainId.value = chainId.value;
  isChainChanged.value = true;
  providerActivated.value = provider;
  signerActivated.value = signer;

  // reset status
  marketplaceConfig.value = { status: null, balance: 0 };

  // Check for money bag qualification
  if (isActivated.value) {
    await displayBalanceOfBFF();
  }

  loader.hide();
});

// For switching back to previous chainId without calling switchChain() again
watch(selectedChainId, async (val, oldVal) => {
  console.log(`from ${oldVal} to ${val}`);

  // Display Loading bar
  let loader = $loading.show({
    container: fullPage ? null : this.$refs.formContainer,
    canCancel: true,
    onCancel: onCancel,
  });

  // Check: bypass the correct chainId
  if (selectedChainId.value === chainIdToUse) {
    loader.hide();
    return;
  }

  // Show up switch network notice
  notify({
    group: "dapp",
    type: "warn",
    title: t("moneyBag.switchNetwork"),
    duration: 6000,
  });

  // Switch network
  try {
    if (wallet.connector) {
      await wallet.connector.switchChain(chainIdToUse);
    }
  } catch (e) {
    switchError.value = true;
    selectedChainId.value = oldVal;
    console.error(e);
  }

  loader.hide();
});

// ----- Reading Functions ------
// get balance from contract
async function displayBalanceOfBFF() {
  // Init Contract
  const BFFContract = new ethers.Contract(
    BFFAddress,
    BFFAbi.abi,
    providerActivated.value
  );

  // get Balance
  let balance_wei;
  balance_wei = await BFFContract.balanceOf(address.value);
  marketplaceConfig.value["balance"] = parseInt(
    ethers.utils.formatEther(balance_wei)
  );

  // get approved status
  let approved_amount;
  approved_amount = await BFFContract.allowance(
    address.value,
    marketplaceAddress
  );
  if (
    ethers.utils.formatUnits(ethers.constants.MaxUint256, "wei") ===
    ethers.utils.formatUnits(approved_amount, "wei")
  ) {
    marketplaceConfig.value["status"] = true;
  }

  console.log("balance : ", marketplaceConfig.value["balance"]);
  console.log("approved status : ", marketplaceConfig.value["status"]);
}

// ----- TX Functions -----
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
// approve BFF token to be used on Marketplace contract
async function approveBFFForMarketPlace() {
  // Display Loading bar
  let loader = $loading.show({
    container: fullPage ? null : this.$refs.formContainer,
    canCancel: true,
    onCancel: onCancel,
  });

  // Init Contract
  const BFFContract = new ethers.Contract(
    BFFAddress,
    BFFAbi.abi,
    signerActivated.value
  );

  // Send Mint TX
  let approveTx;
  try {
    approveTx = await BFFContract.approve(
      marketplaceAddress,
      ethers.utils.formatUnits(ethers.constants.MaxUint256, "wei")
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
    receipt = await handleTransaction(approveTx);
    console.log(`approveTx:${receipt.transactionHash}`, receipt);

    // update approved status
    marketplaceConfig.value["status"] = true;

    // show notification about suucess in case of devices not getting any messages
    notify({
      group: "moneyBag",
      type: "success",
      title: t("marketplace.approvedTitle"),
      text: t("marketplace.approvedContext"),
      duration: 10000,
    });
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
</script>
<style lang="scss">
$class-name: header;
.#{$class-name} {
  @include size(100vw, auto);

  top: 24px;
  position: fixed;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  transform: translateY(-100%);
  z-index: 990;

  &.-active {
    opacity: 1;
    transform: translateY(0);
  }

  &__wrapper {
    display: flex;
    align-items: center;
    @include media-breakpoint-down(tablet) {
      align-items: flex-start;
    }
    p {
      font-size: 40px;
      padding: 0 1rem 0;
      @include media-breakpoint-down(tablet) {
        display: none;
      }
    }
  }

  &__logo {
    @include set-col(1, 12, 0);

    @include media-breakpoint-down(tablet) {
      @include size(120px, auto);
    }
  }

  &__menu {
    @include set-col-offset(0, 12, 2);

    display: flex;
    color: map-get($colors, black);

    @include media-breakpoint-down(tablet) {
      @include size(100vw, auto);

      position: fixed;
      top: -24px;
      left: 0;
      margin-left: 0;
      padding: 64px 20px 20px;
      flex-direction: column;
      align-items: center;
      opacity: 0;
      background-color: map-get($colors, green);
      pointer-events: none;
      transition: opacity 0.3s;

      &.-active {
        opacity: 1;
        pointer-events: auto;
      }

      &-close {
        @include size(27px);

        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 20px;
        right: 20px;

        &::before {
          @include size(34px, 4px);

          content: "";
          position: absolute;
          background-color: map-get($colors, black);
          transform: rotate(45deg);
        }

        &::after {
          @include size(34px, 4px);

          content: "";
          position: absolute;
          background-color: map-get($colors, black);
          transform: rotate(-45deg);
        }
      }

      &-social {
        @include size(100%, auto);

        display: flex !important;
        justify-content: space-evenly;
        margin-top: 20px;

        &-icon {
          @include size(56px);

          > svg {
            @include size(100%);
          }
        }
      }
    }

    > li {
      @include typo("heading", 2);

      margin-right: 36px;
      cursor: pointer;

      @include media-breakpoint-down(tablet) {
        @include size(100%, auto);

        border-bottom: 2px solid map-get($colors, black);
        padding-bottom: 16px;
        margin-right: 0;
        margin-bottom: 16px;
        text-align: center;
      }
    }

    &-social {
      display: none;
    }
  }

  &__nav {
    display: flex;
    margin-left: auto;
    color: map-get($colors, white);

    @include media-breakpoint-down(tablet) {
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    > * {
      margin-left: 36px;
      cursor: pointer;
      @include media-breakpoint-down(tablet) {
        margin-left: 5px;
      }
    }

    &-btn {
      @include typo("button", 1);

      &.yellow {
        background-color: map-get($colors, yellow);
        border: 1px solid map-get($colors, yellow);
        color: map-get($colors, black);
      }
      &.gray {
        background-color: map-get($colors, grays);
        border: 1px solid map-get($colors, grays);
      }
    }

    &-icon {
      @include size(34px, 28px);

      color: map-get($colors, black);

      @include media-breakpoint-down(tablet) {
        display: none;
      }

      > svg {
        @include size(100%);
      }
    }

    &-hamburger {
      display: none;

      @include media-breakpoint-down(tablet) {
        display: flex !important;
        flex-direction: column;

        @include media-breakpoint-down(tablet) {
          display: none;
        }

        > span {
          @include size(34px, 4px);

          background-color: map-get($colors, black);
          border-radius: 4px;
          margin-bottom: 3px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
