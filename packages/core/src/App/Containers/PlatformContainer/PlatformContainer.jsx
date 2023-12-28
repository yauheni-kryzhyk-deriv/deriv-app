import React from 'react';
import { PlatformContext } from '@deriv/shared';

const DERIV_APPSTORE_KEY = 'is_appstore';
const DERIV_PASSKEYS_KEY = 'is_passkeys_enabled';

// TODO: remove 'is_appstore' as it is deprecated
const PlatformContainer = props => {
    // TODO: set is_appstore based on a flag from BE.
    const is_appstore_storage = window.localStorage.getItem(DERIV_APPSTORE_KEY) === 'true';
    const is_passkeys_enabled_storage = window.localStorage.getItem(DERIV_PASSKEYS_KEY) === 'true';
    const [is_appstore, setIsAppStore] = React.useState(is_appstore_storage);
    const [is_passkeys_enabled, setIsPasskeysEnabled] = React.useState(is_passkeys_enabled_storage);

    const platform_store = {
        is_appstore,
        is_passkeys_enabled,
        setIsAppStore,
        setIsPasskeysEnabled,
        DERIV_APPSTORE_KEY,
        DERIV_PASSKEYS_KEY,
    };

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformContainer;
