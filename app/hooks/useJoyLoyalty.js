import {useEffect} from 'react';

const joySdk = `https://cdn.shopify.com/extensions/5e2b8eb3-5720-4075-8ce3-fe9c434c4cf2/0.0.0/assets/avada-joy.min.js?v=${new Date().getTime()}`;

/**
 *
 * @param joyData
 * @param joyShopData
 * @param cart
 * @param customer
 * @param publicStoreDomain
 */
export function useJoyLoyalty({
  joyData,
  joyShopData,
  cart,
  customer,
  publicStoreDomain,
}) {
  useEffect(() => {
    try {
      window.AVADA_JOY = window.AVADA_JOY || {};
      window.AVADA_JOY.customer = customer
        ? {
            ...customer,
            first_name: customer.firstName,
            last_name: customer.lastName,
            id: parseFloat(customer.id.replace('gid://shopify/Customer/', '')),
          }
        : {email: null, first_name: null, last_name: null, id: null};
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        placeOrder: {
          ...joyData.placeOrder,
        },
      };
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        tierSettings: {
          ...joyData.tierSettings,
        },
      };
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        allTiers: joyData.allTiers,
      };
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        pointCalculator: joyData.pointCalculator,
      };
      window.AVADA_JOY.account_enabled = 'true';
      window.AVADA_JOY.login_url = '/account/login';
      window.AVADA_JOY.register_url = '/account/register';
      window.AVADA_JOY.cartProducts =
        cart?.lines?.edges?.map(({node}) => node) || [];
      window.AVADA_JOY.shopId = joyData.shopId;

      window.Shopify = window.Shopify || {};
      window.Shopify.currency = window.Shopify.currency || {
        active: joyShopData?.currencyCode,
        rate: '1.0',
      };
      window.Shopify.locale = joyShopData?.locale?.toLowerCase() || null;
      window.Shopify.country = joyShopData?.countryCode || null;
      window.Shopify.shop = publicStoreDomain || null;

      loadScript({
        id: 'avada-joy-script',
        url: joySdk,
      });
    } catch (e) {
      console.log('Cannot initialize Joy Loyalty', e);
    }
  }, []);
}

/**
 *
 * @param {Object} options
 * @param {string | null} [options.id=null]
 * @param {string | null} [options.url=null]
 */
function loadScript({id = null, url = null} = {}) {
  const hasScript = document.querySelector(`#${id}`);
  if (!hasScript) {
    const script = document.createElement('script');
    script.id = id;
    script.setAttribute('src', url);
    script.async = true;
    document.body.appendChild(script);
  }
}
