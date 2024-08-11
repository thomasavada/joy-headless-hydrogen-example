export const JOY_SHOP_DATA_QUERY = `#graphql
query {
    localization {
        language {
            name
            isoCode
        }
        country {
            currency {
                isoCode
            }
            isoCode
        }
    }
    shop {
        metafield (namespace: "joy_loyalty_avada", key: "data"){
            value
        }
    }
}
`;
