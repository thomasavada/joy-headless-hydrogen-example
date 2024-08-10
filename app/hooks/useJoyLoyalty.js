import {useEffect} from 'react';

/**
 *
 * @param {Object} options
 * @param {string | null} [options.id=null]
 * @param {string | null} [options.url=null]
 */
export default function loadScript({id = null, url = null} = {}) {
  const hasScript = document.querySelector(`#${id}`);
  if (!hasScript) {
    const script = document.createElement('script');
    script.id = id;
    script.setAttribute('src', url);
    script.async = true;
    document.body.appendChild(script);
  }
}

/**
 *
 * @param data
 */
export function useJoyLoyalty(data) {
  useEffect(() => {
    try {
      window.AVADA_JOY = window.AVADA_JOY || {};
      window.AVADA_JOY.customer = data.customer
        ? {
            ...data.customer,
            first_name: data.customer.firstName,
            last_name: data.customer.lastName,
            id: parseFloat(
              data.customer.id.replace('gid://shopify/Customer/', ''),
            ),
          }
        : {email: null, first_name: null, last_name: null, id: null};
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        placeOrder: {
          ...data.joyData.placeOrder,
        },
      };
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        tierSettings: {
          ...data.joyData.tierSettings,
        },
      };
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        allTiers: data.joyData.allTiers,
      };
      window.AVADA_JOY = {
        ...window.AVADA_JOY,
        pointCalculator: data.joyData.pointCalculator,
      };
      window.AVADA_JOY.account_enabled = 'true';
      window.AVADA_JOY.login_url = '/account/login';
      window.AVADA_JOY.register_url = '/account/register';
      window.AVADA_JOY.cartProducts =
        data?.cart?.lines?.edges?.map(({node}) => node) || [];
      window.AVADA_JOY.shopId = data.joyData.shopId;

      window.Shopify = window.Shopify || {};
      window.Shopify.currency = window.Shopify.currency || {
        active: 'VND',
        rate: '1.0',
      };
      window.Shopify.locale =
        data?.selectedLocale?.language?.toLowerCase() || null;
      window.Shopify.country = data?.selectedLocale?.country || null;
      window.Shopify.shop = data?.publicStoreDomain || null;

      loadScript({
        id: 'avada-joy-script',
        url: `https://cdn.shopify.com/extensions/5e2b8eb3-5720-4075-8ce3-fe9c434c4cf2/0.0.0/assets/avada-joy.min.js?v=${new Date().getTime()}`,
      });
    } catch (e) {
      console.log('Cannot initialize Avada Joy', e);
    }
  }, []);
}
