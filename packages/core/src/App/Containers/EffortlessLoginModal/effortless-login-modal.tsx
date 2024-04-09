import React from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router';
import FormFooter from '@deriv/account/src/Components/form-footer';
import FormBody from '@deriv/account/src/Components/form-body';
import { Button, Icon, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { EffortLessLoginTips } from './effortless-login-tips';
import { EffortlessLoginDescription } from './effortless-login-description';
import './effortless-login-modal.scss';

const EffortlessLoginModal = observer(() => {
    const [is_learn_more_opened, setIsLearnMoreOpened] = React.useState(false);
    const portal_element = document.getElementById('effortless_modal_root');
    const history = useHistory();
    const { client } = useStore();
    const { setShouldShowEffortlessLoginModal, passkeysTrackEvent } = client;

    React.useEffect(() => {
        if (!portal_element) return;
        passkeysTrackEvent({ action: 'open' }, true);

        const track_close = () => {
            passkeysTrackEvent({ action: 'close' }, true);
        };
        window.addEventListener('beforeunload', track_close);
        return () => {
            window.removeEventListener('beforeunload', track_close);
        };
    }, []);

    const onClickHandler = (route: string, action_event: string) => {
        localStorage.setItem('show_effortless_login_modal', JSON.stringify(false));
        history.push(route);
        setShouldShowEffortlessLoginModal(false);
        passkeysTrackEvent({ action: action_event }, true);
    };

    const onLearnMoreClick = () => {
        setIsLearnMoreOpened(true);
        passkeysTrackEvent({ action: 'info_open' }, true);
    };

    if (!portal_element) return null;
    return ReactDOM.createPortal(
        <div className={'effortless-login-modal'}>
            {is_learn_more_opened ? (
                <Icon
                    data_testid='effortless_login_modal__back-button'
                    icon='IcBackButton'
                    onClick={() => setIsLearnMoreOpened(false)}
                    className='effortless-login-modal__back-button'
                />
            ) : (
                <Text
                    as='div'
                    size='xxs'
                    color='loss-danger'
                    weight='bold'
                    line_height='xl'
                    align='right'
                    className='effortless-login-modal__header'
                    onClick={() => onClickHandler(routes.traders_hub, 'maybe_later')}
                >
                    <Localize i18n_default_text='Maybe later' />
                </Text>
            )}

            <FormBody scroll_offset='15rem' className='effortless-login-modal__wrapper'>
                <Icon icon='IcInfoPasskey' size={96} />
                <Text as='div' color='general' weight='bold' align='center' className='effortless-login-modal__title'>
                    <Localize i18n_default_text='Effortless login with passkeys' />
                </Text>
                {is_learn_more_opened ? (
                    <EffortlessLoginDescription />
                ) : (
                    <EffortLessLoginTips onLearnMoreClick={onLearnMoreClick} />
                )}
            </FormBody>
            <FormFooter>
                <Button
                    type='button'
                    has_effect
                    large
                    primary
                    onClick={() => onClickHandler(routes.passkeys, 'get_started')}
                >
                    <Localize i18n_default_text='Get started' />
                </Button>
            </FormFooter>
        </div>,
        portal_element
    );
});

export default EffortlessLoginModal;
