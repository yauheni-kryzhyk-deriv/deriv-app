import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { HintBox, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TOnfidoSdkView = {
    is_onfido_disabled: boolean;
    is_onfido_container_hidden?: boolean;
    onfido_element_id?: string;
    is_confirmed: boolean;
    data_testid?: string;
};

const OnfidoSdkView = ({
    is_onfido_disabled,
    is_onfido_container_hidden,
    onfido_element_id = 'onfido',
    is_confirmed,
    data_testid,
}: TOnfidoSdkView) => {
    const [is_status_message_visible, setIsStatusMessageVisible] = React.useState(false);

    React.useEffect(() => {
        const onConfirm = () => {
            setTimeout(() => {
                setIsStatusMessageVisible(true);
            }, 800);
            setTimeout(() => {
                setIsStatusMessageVisible(false);
            }, 4650);
        };

        if (is_confirmed) {
            onConfirm();
        }
    }, [is_confirmed]);

    return (
        <div className='onfido-container-view_wrapper'>
            <div className={classNames({ 'onfido-container__status-message_container': !is_onfido_disabled })}>
                <CSSTransition
                    appear={is_status_message_visible}
                    in={is_status_message_visible}
                    timeout={{
                        exit: 350,
                    }}
                    classNames={{
                        exit: 'onfido-container__status-message--exit',
                    }}
                    unmountOnExit
                >
                    <HintBox
                        className='onfido-container__status-message'
                        icon='IcAlertAnnounce'
                        icon_height={16}
                        icon_width={16}
                        message={
                            <Text as='p' size='xxxs'>
                                <Localize i18n_default_text='Your personal details have been saved successfully.' />
                            </Text>
                        }
                        is_info
                    />
                </CSSTransition>
            </div>
            {is_onfido_disabled && (
                <HintBox
                    className='onfido-container__info-message'
                    icon='IcInfoBlue'
                    icon_height={16}
                    icon_width={16}
                    message={
                        <Text as='p' size='xxxs'>
                            <Localize i18n_default_text='Hit the checkbox above to choose your document.' />
                        </Text>
                    }
                    is_info
                />
            )}
            <div
                data-testid={data_testid}
                id={onfido_element_id}
                className={classNames({
                    'onfido-container__disabled': is_onfido_disabled,
                    'onfido-container__hidden': is_onfido_container_hidden,
                })}
            />
        </div>
    );
};

export default OnfidoSdkView;
