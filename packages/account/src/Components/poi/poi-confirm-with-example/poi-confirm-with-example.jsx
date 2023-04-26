import PoiNameDobExample from 'Assets/ic-poi-name-dob-example.svg';
import React from 'react';
import { localize } from '@deriv/translations';
import InlineNoteWithIcon from 'Components/inline-note-with-icon';
import { connect } from 'Stores/connect';
// import RootStore from 'Stores/index';
import classNames from 'classnames';
import { Formik } from 'formik';
import {
    Checkbox,
    DateOfBirthPicker,
    DesktopWrapper,
    // FormSubmitErrorMessage,
    Input,
    Loading,
    MobileWrapper,
    // useStateCallback,
} from '@deriv/components';
import { WS, filterObjProperties, toMoment, validLength, validName } from '@deriv/shared';
import FormBody from 'Components/form-body';
import FormBodySection from 'Components/form-body-section';
import LoadErrorMessage from 'Components/load-error-message';

// type TPoiConfirmWithExample = {
//     account_settings;
//     getChangeableFields: () => string[];
//     updateAccountStatus: () => void;
// } & (
//     | {
//           name_dob_clarification_message?: string;
//           name_clarification_message?: never;
//           dob_clarification_message?: never;
//       }
//     | {
//           name_dob_clarification_message?: never;
//           name_clarification_message?: string;
//           dob_clarification_message?: never;
//       }
//     | {
//           name_dob_clarification_message?: never;
//           name_clarification_message?: never;
//           dob_clarification_message?: string;
//       }
// );

// const PoiNameDobExampleIcon = PoiNameDobExample as React.ElementType;
const PoiNameDobExampleIcon = PoiNameDobExample;

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (/^\s+$/.test(value) || (!fn(value) && !errors[field] && err_msg !== true)) errors[field] = err_msg;
    });
};

// type TValues = {};

const PoiConfirmWithExample = ({
    account_settings,
    dob_clarification_message,
    getChangeableFields,
    name_clarification_message,
    name_dob_clarification_message,
    onConfirm,
    updateAccountStatus,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [checked, setChecked] = React.useState(false);
    const [rest_state, setRestState] = React.useState({
        show_form: true,
        errors: false,
        form_initial_values: {},
        changeable_fields: [],
    });

    React.useEffect(() => {
        initializeFormValues();
    }, [account_settings]);

    const makeSettingsRequest = settings => {
        const request = filterObjProperties(settings, [...rest_state?.changeable_fields]);

        if (request.first_name) {
            request.first_name = request.first_name.trim();
        }
        if (request.last_name) {
            request.last_name = request.last_name.trim();
        }
        if (request.date_of_birth) {
            request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
        }

        return request;
    };

    const onSubmit = async (values, { setStatus, setSubmitting }) => {
        if (checked) return;
        setStatus({ msg: '' });
        const request = makeSettingsRequest(values);
        const data = await WS.setSettings(request);

        if (data.error) {
            setStatus({ msg: data.error.message });
            setSubmitting(false);
        } else {
            const response = await WS.authorized.storage.getSettings();
            if (response.error) {
                setRestState({ ...rest_state, api_error: response.error.message });
                return;
            }
            updateAccountStatus();
            setRestState({ ...rest_state, ...response.get_settings });
            setChecked(true);
            setIsLoading(false);
            onConfirm();
        }
    };

    const validateFields = values => {
        const errors = {};
        const validateValues = validate(errors, values);

        const required_fields = ['first_name', 'last_name', 'date_of_birth'];

        validateValues(val => val, required_fields, localize('This field is required'));

        const min_name = 2;
        const max_name = 50;
        const validateName = (name, field) => {
            if (name) {
                if (!validLength(name.trim(), { min: min_name, max: max_name })) {
                    errors[field] = localize('You should enter 2-50 characters.');
                } else if (!validName(name)) {
                    errors[field] = localize('Letters, spaces, periods, hyphens, apostrophes only.');
                }
            }
        };
        validateName(values.first_name, 'first_name');
        validateName(values.last_name, 'last_name');

        setRestState({ ...rest_state, errors: Object.keys(errors).length > 0 });
        return errors;
    };

    const initializeFormValues = () => {
        WS.wait('get_settings').then(() => {
            const visible_settings = ['first_name', 'last_name', 'date_of_birth'];
            const form_initial_values = filterObjProperties(account_settings, visible_settings);
            setRestState({
                ...rest_state,
                changeable_fields: getChangeableFields(),
                form_initial_values,
            });
            setIsLoading(false);
        });
    };

    const {
        form_initial_values: { ...form_initial_values },
        api_error,
    } = rest_state;

    if (api_error) return <LoadErrorMessage error_message={api_error} />;

    if (is_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    const getFormSideNote = () => {
        let form_side_note;
        if (name_dob_clarification_message) {
            form_side_note = <PoiNameDobExampleIcon />;
        }
        //below two form_side_note option will be implemented for showing proper example picture
        if (name_clarification_message) {
            form_side_note = 'name example';
        }
        if (dob_clarification_message) {
            form_side_note = 'dob example';
        }
        return form_side_note;
    };

    return (
        <Formik initialValues={form_initial_values} enableReinitialize onSubmit={onSubmit} validate={validateFields}>
            {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                <form
                    noValidate
                    className={classNames('account-form__poi-confirm-example', {})}
                    onSubmit={handleSubmit}
                >
                    <InlineNoteWithIcon message={name_dob_clarification_message} font_size='xs' />
                    <FormBody>
                        <FormBodySection has_side_note side_note={getFormSideNote()}>
                            <DesktopWrapper>
                                <fieldset className='account-form__fieldset'>
                                    <Input
                                        data-lpignore='true'
                                        type='text'
                                        name='first_name'
                                        label={localize('First name')}
                                        value={values.first_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        disabled={checked || isSubmitting}
                                        error={errors.first_name}
                                        id={'first_name'}
                                        bottom_label={localize('Your first name as in your identity document')}
                                    />
                                    <Input
                                        id={'last_name'}
                                        data-lpignore='true'
                                        type='text'
                                        name='last_name'
                                        label={localize('Last name')}
                                        value={values.last_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        disabled={checked || isSubmitting}
                                        error={errors.last_name}
                                        bottom_label={localize('Your last name as in your identity document')}
                                    />
                                    <DateOfBirthPicker
                                        name='date_of_birth'
                                        label={localize('Date of birth')}
                                        error={errors.date_of_birth}
                                        onChange={({ target }) => {
                                            setFieldValue(
                                                'date_of_birth',
                                                target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '',
                                                true
                                            );
                                        }}
                                        id={'birth_day'}
                                        disabled={checked || isSubmitting}
                                        value={values.date_of_birth}
                                        bottom_label={localize('Your date of birth as in your identity document')}
                                    />
                                </fieldset>
                            </DesktopWrapper>
                            <MobileWrapper>
                                <fieldset className='account-form__fieldset'>
                                    <Input
                                        data-lpignore='true'
                                        type='text'
                                        name='first_name'
                                        id='first_name_mobile'
                                        label={localize('First name')}
                                        value={values.first_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        disabled={checked || isSubmitting}
                                        error={errors.first_name}
                                        bottom_label={localize('Your first name as in your identity document')}
                                    />
                                </fieldset>
                                <fieldset className='account-form__fieldset'>
                                    <Input
                                        data-lpignore='true'
                                        type='text'
                                        name='last_name'
                                        id='last_name_mobile'
                                        label={localize('Last name')}
                                        value={values.last_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        disabled={checked || isSubmitting}
                                        error={errors.last_name}
                                        bottom_label={localize('Your last name as in your identity document')}
                                    />
                                </fieldset>
                            </MobileWrapper>
                        </FormBodySection>
                        <button
                            type='submit'
                            className={classNames('account-form__poi-confirm-example--button', {
                                'account-form__poi-confirm-example--button__disabled': checked,
                            })}
                        >
                            <Checkbox
                                value={checked}
                                label={localize(
                                    'I confirm that the name and date of birth above match my chosen identity document (see below)'
                                )}
                                disabled={isSubmitting}
                            />
                        </button>
                    </FormBody>
                </form>
            )}
        </Formik>
    );
};

export default connect(({ client }) => ({
    account_settings: client.account_settings,
    getChangeableFields: client.getChangeableFields,
    updateAccountStatus: client.updateAccountStatus,
}))(PoiConfirmWithExample);
