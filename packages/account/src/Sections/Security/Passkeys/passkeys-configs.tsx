import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { mobileOSDetect } from '@deriv/shared';
import { DescriptionContainer } from './components/description-container';
import { EffortLessLoginTips } from './components/effortless-login-tips';
import { TipsBlock } from './components/tips-block';

export const PASSKEY_STATUS_CODES = {
    CREATED: 'created',
    EFFORTLESS_LOGIN: 'effortless_login',
    LEARN_MORE: 'learn_more',
    NONE: '',
    NO_PASSKEY: 'no_passkey',
    REMOVED: 'removed',
    RENAMING: 'renaming',
    VERIFYING: 'verifying',
} as const;

export type TPasskeysStatus = typeof PASSKEY_STATUS_CODES[keyof typeof PASSKEY_STATUS_CODES];

export const getStatusContent = (status: Exclude<TPasskeysStatus, ''>, onTextClick?: () => void) => {
    const learn_more_button_text = <Localize i18n_default_text='Learn more' />;
    const create_passkey_button_text = <Localize i18n_default_text='Create passkey' />;
    const continue_button_text = <Localize i18n_default_text='Continue' />;

    const getPasskeysRemovedDescription = () => {
        const os_type = mobileOSDetect();

        switch (os_type) {
            case 'Android':
                return (
                    <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your Google password manager. ' />
                );
            case 'iOS':
                return (
                    <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your iCloud keychain. ' />
                );
            default:
                return (
                    <Localize i18n_default_text='Your passkey is successfully removed. To avoid sign-in prompts, also remove the passkey from your password manager. ' />
                );
        }
    };

    const titles = {
        created: <Localize i18n_default_text='Success!' />,
        effortless_login: <Localize i18n_default_text='Effortless login with passkeys' />,
        learn_more: <Localize i18n_default_text='Passwordless login with passkeys' />,
        no_passkey: <Localize i18n_default_text='No passkey found' />,
        removed: <Localize i18n_default_text='Passkey successfully removed' />,
        renaming: <Localize i18n_default_text='Edit passkey' />,
        verifying: <Localize i18n_default_text='Verify your request' />,
    };
    const descriptions = {
        created: (
            <Localize
                i18n_default_text='Your account is now secured with a passkey.<0/>Manage your passkey through your Deriv account settings.'
                components={[<br key={0} />]}
            />
        ),
        //TODO add the rest of decriptions
        effortless_login: <EffortLessLoginTips onLearnMoreClick={onTextClick} />,
        learn_more: (
            <React.Fragment>
                <DescriptionContainer />
                <TipsBlock />
            </React.Fragment>
        ),
        no_passkey: (
            <Localize
                i18n_default_text="To enhance your security, tap 'Create passkey' below. Learn more about passkeys <0>here</0>."
                components={[<Text key={0} color='loss-danger' size='xs' onClick={onTextClick} />]}
            />
        ),
        removed: getPasskeysRemovedDescription(),
        renaming: '',
        verifying: (
            <Localize i18n_default_text="We'll send you a secure link to verify your request. Tap on it to confirm you want to remove the passkey. This protects your account from unauthorised requests." />
        ),
    };
    const icons = {
        created: 'IcSuccessPasskey',
        effortless_login: 'IcInfoPasskey',
        learn_more: 'IcInfoPasskey',
        no_passkey: 'IcAddPasskey',
        removed: 'IcSuccessPasskey',
        renaming: 'IcEditPasskey',
        verifying: 'IcVerifyPasskey',
    };
    const button_texts = {
        created: continue_button_text,
        effortless_login: create_passkey_button_text,
        learn_more: create_passkey_button_text,
        no_passkey: create_passkey_button_text,
        removed: continue_button_text,
        renaming: <Localize i18n_default_text='Save changes' />,
        verifying: <Localize i18n_default_text='Send email' />,
    };
    const back_button_texts = {
        created: undefined,
        effortless_login: undefined,
        learn_more: undefined,
        no_passkey: learn_more_button_text,
        removed: undefined,
        renaming: <Localize i18n_default_text='Back' />,
        verifying: undefined,
    };

    return {
        title: titles[status],
        description: descriptions[status],
        icon: icons[status],
        primary_button_text: button_texts[status],
        secondary_button_text: back_button_texts[status],
    };
};

export const getErrorContent = (error_message: string | null) => {
    const is_not_allowed_error = error_message?.includes('NotAllowedError');

    const reloadPage = () => location.reload();

    const try_again_button_text = <Localize i18n_default_text='Try again' />;

    if (is_not_allowed_error) {
        return {
            title: <Localize i18n_default_text='Unable to setup passkey' />,
            description: (
                <Localize i18n_default_text='We encountered an issue while setting up your passkey. The process might have been interrupted or the session timed out. Please try again.' />
            ),
            button_text: try_again_button_text,
            buttonOnclick: reloadPage,
        };
    }

    return {
        title: undefined,
        description: <Localize i18n_default_text='Some issue occured' />,
        button_text: try_again_button_text,
        buttonOnclick: reloadPage,
    };
};
