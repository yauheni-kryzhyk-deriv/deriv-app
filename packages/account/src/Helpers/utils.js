import { getUrlBase } from '@deriv/shared';

const getImageLocation = image_name => getUrlBase(`/public/images/common/${image_name}`);

// Note: Ensure that the object keys matches BE API's keys. This is simply a mapping for FE templates
const idv_document_data = {
    ke: {
        alien_card: {
            new_display_name: '',
            example_format: '123456',
            sample_image: getImageLocation('ke_alien_card.png'),
        },
        national_id: {
            new_display_name: '',
            example_format: '12345678',
            sample_image: getImageLocation('ke_national_identity_card.png'),
        },
        passport: {
            new_display_name: '',
            example_format: 'A12345678',
            sample_image: getImageLocation('ke_passport.png'),
        },
    },
    za: {
        national_id: {
            new_display_name: 'National ID',
            example_format: '1234567890123',
            sample_image: getImageLocation('za_national_identity_card.png'),
        },
        national_id_no_photo: {
            new_display_name: 'National ID (No Photo)',
            example_format: '1234567890123',
            sample_image: '',
        },
    },
    ng: {
        bvn: {
            new_display_name: 'Bank Verification Number',
            example_format: '12345678901',
            sample_image: '',
        },
        cac: {
            new_display_name: 'Corporate Affairs Commission',
            example_format: '12345678',
            sample_image: '',
        },
        drivers_license: {
            new_display_name: '',
            example_format: 'ABC123456789',
            sample_image: getImageLocation('ng_drivers_license.png'),
        },
        nin: {
            new_display_name: 'National Identity Number',
            example_format: '12345678901',
            sample_image: '',
        },
        nin_slip: {
            new_display_name: 'National Identity Number Slip',
            example_format: '12345678901',
            sample_image: getImageLocation('ng_nin_slip.png'),
        },
        tin: {
            new_display_name: 'Taxpayer identification number',
            example_format: '12345678-1234',
            sample_image: '',
        },
        voter_id: {
            new_display_name: 'Voter ID',
            example_format: '1234567890123456789',
            sample_image: getImageLocation('ng_voter_id.png'),
        },
    },
    gh: {
        drivers_license: {
            new_display_name: '',
            example_format: 'B1234567',
            sample_image: '',
        },
        national_id: {
            new_display_name: 'National ID',
            example_format: 'GHA-123456789-1',
            sample_image: '',
        },
        passport: {
            new_display_name: 'Passport',
            example_format: 'G1234567',
            sample_image: '',
        },
        ssnit: {
            new_display_name: 'Social Security and National Insurance Trust',
            example_format: 'C123456789012',
            sample_image: '',
        },
        voter_id: {
            new_display_name: 'Voter ID',
            example_format: '01234567890',
            sample_image: '',
        },
    },
    br: {
        cpf: {
            new_display_name: 'CPF',
            example_format: '123.456.789-12',
            sample_image: '',
        },
    },
    ug: {
        national_id: {
            new_display_name: 'National ID',
            example_format: 'CM12345678PE1D',
            sample_image: getImageLocation('ug_national_identity_card.png'),
        },
        national_id_no_photo: {
            new_display_name: 'National ID (No Photo)',
            example_format: 'CM12345678PE1D',
            sample_image: '',
        },
    },
    zw: {
        national_id: {
            new_display_name: 'National ID',
            example_format: '081234567F53',
            sample_image: getImageLocation('zw_national_identity_card.png'),
        },
    },
};

export const shouldShowIdentityInformation = ({
    account_status,
    account_settings,
    residence,
    residence_list,
    real_account_signup_target,
}) => {
    const citizen = account_settings.citizen || residence;
    const country = residence_list.find(item => item.value === citizen);
    const maltainvest = real_account_signup_target === 'maltainvest';
    const should_skip_idv = account_status?.status?.some(status => status === 'skip_idv'); //status added by BE when idv should be skipped for the user
    return !maltainvest && citizen && country?.identity?.services?.idv?.is_country_supported && !should_skip_idv;
};

export const getDocumentData = (country_code, document_type) => {
    return (
        (Object.keys(idv_document_data).includes(country_code) && idv_document_data[country_code][document_type]) || {
            new_display_name: '',
            example_format: '',
            sample_image: '',
        }
    );
};

export const preventEmptyClipboardPaste = e => {
    const clipboardData = (e.clipboardData || window.clipboardData).getData('text');
    if (clipboardData.length === 0) {
        e.preventDefault();
    }
};
