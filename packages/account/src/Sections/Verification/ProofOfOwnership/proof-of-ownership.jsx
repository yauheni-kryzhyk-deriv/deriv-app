import React from 'react';
import { withRouter } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { POO_STATUSES } from './constants/constants';
import VerificationStatus from '../../../Components/verification-status/verification-status';
import getPaymentMethodsConfig from './payment-method-config.js';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import { getPOOStatusMessages } from './proof-of-ownership-utils';

export const ProofOfOwnership = observer(() => {
    const { client, notifications, ui } = useStore();
    const { account_status, email: client_email, updateAccountStatus } = client;
    const { refreshNotifications } = notifications;
    const { is_dark_mode_on: is_dark_mode } = ui;
    const cards = account_status?.authentication?.ownership?.requests;
    const [status, setStatus] = React.useState(POO_STATUSES.none);
    const [is_loading, setIsLoading] = React.useState(true);
    const citizen = client?.account_settings?.citizen || client?.account_settings?.country_code;

    const grouped_payment_method_data = React.useMemo(() => {
        const groups = {};
        const payment_methods_config = getPaymentMethodsConfig();
        cards?.forEach(card => {
            const card_details =
                payment_methods_config[card.payment_method.toLowerCase()] || payment_methods_config.other;
            if (groups[card?.payment_method?.toLowerCase()]) {
                groups[card?.payment_method?.toLowerCase()].items.push(card);
            } else {
                groups[card?.payment_method?.toLowerCase()] = {
                    documents_required: card?.documents_required,
                    icon: is_dark_mode ? card_details?.icon_dark : card_details?.icon_light,
                    payment_method: card?.payment_method,
                    items: [card],
                    instructions: card_details.instructions,
                    input_label: card_details?.input_label,
                    identifier_type: card_details.identifier_type,
                    is_generic_pm: !card_details?.input_label,
                };
            }
        });
        return { groups };
    }, [cards, is_dark_mode]);

    React.useEffect(() => {
        setStatus(account_status?.authentication?.ownership?.status?.toLowerCase());
        setIsLoading(false);
    }, [account_status]);

    const onTryAgain = () => {
        setStatus(POO_STATUSES.none);
    };

    const status_content = React.useMemo(() => getPOOStatusMessages(status), [status]);

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;

    if (cards?.length > 0 && status !== POO_STATUSES.rejected) {
        return (
            <ProofOfOwnershipForm
                grouped_payment_method_data={grouped_payment_method_data.groups}
                updateAccountStatus={updateAccountStatus}
                refreshNotifications={refreshNotifications}
                client_email={client_email}
                citizen={citizen}
            />
        );
    }
    return (
        <VerificationStatus
            icon={status_content.icon}
            status_description={status_content.description}
            status_title={status_content.title}
        >
            {status_content.action_button?.(onTryAgain)}
        </VerificationStatus>
    );
});

export default withRouter(ProofOfOwnership);
