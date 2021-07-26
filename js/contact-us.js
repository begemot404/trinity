jQuery(function($) {
    // Letters only filter
    $.validator.addMethod(
        "lettersonly",
        function(value, element) {
            return this.optional(element) || /^[a-z]+$/i.test(value);
        },
        "Letters only please"
    );

    /**
     * Matches US phone number format
     *
     * where the area code may not start with 1 and the prefix may not start with 1
     * allows '-' or ' ' as a separator and allows parens around area code
     * some people may want to put a '1' in front of their number
     *
     * 1(212)-999-2345 or
     * 212 999 2344 or
     * 212-999-0983
     *
     * but not
     * 111-123-5434
     * and not
     * 212 123 4567
     */
    $.validator.addMethod(
        "phoneUS",
        function(phone_number, element) {
            phone_number = phone_number.replace(/\s+/g, "");
            return (
                this.optional(element) ||
                (phone_number.length > 9 &&
                    phone_number.match(
                        /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]\d{2}-?\d{4}$/
                    ))
            );
        },
        "Phone (Not valid)"
    );

    let submitted = false;

    // Form validation
    const form = $("#contact-form");
    const formTitle = form.find(".form-title");
    const defaultTitle = formTitle.text();
    const btnSubmit = form.find("button[type='submit']");

    form.validate({
        errorPlacement: function(error, element) {
            // name attrib of the field
            var name = element.attr("name");

            changeFormControlText(element, name, true);
        },
        rules: {
            firstName: {
                required: true
            },
            lastName: {
                required: true
            },
            company: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                phoneUS: true
            },
            message: {
                required: true
            }
        },
        highlight: function(element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function(element) {
            $(element).removeClass("is-invalid");

            let invalidList = form.find(
                "input.form-control.is-invalid:required"
            );
            if (!invalidList.length) {
                formTitle.text("Contact Us:");
                formTitle.removeClass("is-invalid");
            }
        },
        submitHandler: function(_form) {
            let promises = [];

            let p1 = new Promise(function(resolve, reject) {
                sendContactFormEmail(_form, resolve, reject);
            });

            let p2 = new Promise(function(resolve, reject) {
                saveContactForm(_form, resolve, reject);
            });

            promises.push(p1);
            promises.push(p2);

            btnSubmit.attr("disabled", true);

            Promise.all(promises)
                .then(() => {
                    form.validate().resetForm();
                    form[0].reset();

                    // Set Deafult form settings
                    const element = $(_form).find(".form-control");
                    formTitle.text("Successfully Sent!");

                    $.each(element, (index, item) => {
                        const input = $(item);
                        const name = input.attr("name");

                        changeFormControlText(input, name);
                    });

                    window.location.href = "/thank-you/";
                    

                    $(_form).addClass("success");

                    setTimeout(function() {
                        $(_form).removeClass("success");
                        formTitle.text(defaultTitle);

                        btnSubmit.attr("disabled", false);
                    }, 5000);

                    if (typeof dataLayer !== "undefined") {
                        dataLayer.push({ event: "contact_form_submitted" });
                    }
                })
                .catch(err => {
                    formTitle.text("An error occurred, please try again later");
                    formTitle.addClass("is-invalid");

                    btnSubmit.attr("disabled", false);
                    console.log(err);
                });

            return false;
        },
        showErrors: function(errorMap, errorList) {
            if (submitted) {
                errorList.map(item => {
                    const currentItem = $(item.element);
                    const name = currentItem.attr("name");
                    const value = currentItem.val();

                    if (name === "phone" && value !== "") {
                        currentItem.attr("placeholder", item.message);
                    }
                });

                if (errorList.length) {
                    formTitle.text("Sorry, can you fix this before sending?");
                    formTitle.addClass("is-invalid");
                }
            }

            this.defaultShowErrors();
        },
        invalidHandler: function(form, validator) {
            submitted = true;
        }
    });

    const changeFormControlText = (element, name, showRequired) => {
        const text = showRequired ? " (Required)" : "";

        switch (name) {
            case "firstName":
                element.attr("placeholder", "First name" + text);
                break;

            case "lastName":
                element.attr("placeholder", "Last name" + text);
                break;

            case "company":
                element.attr("placeholder", "Company" + text);
                break;

            case "email":
                element.attr("placeholder", "Email" + text);
                break;

            case "phone":
                if (element.val() === "") {
                    element.attr("placeholder", "Phone" + text);
                } else if (submitted) {
                    element.val("");
                }
                submitted = false;
                break;

            case "message":
                element.attr("placeholder", "Message" + text);
                break;

            default:
                break;
        }
    };

    const sendContactFormEmail = (_form, resolve, reject) => {
        btnSubmit.attr("disabled", true);

        var formUrl = "https://formspree.io/" + ENV.contactUs.formspreeCode;
        var formData = $(_form).serialize();

        $.ajax({
            url: formUrl,
            type: "POST",
            data: formData,
            cache: false,
            dataType: "json",
            success: () => {
                resolve();
            },
            error: error => {
                reject(error);
            }
        });

        return false;
    };

    const saveContactForm = (_form, resolve, reject) => {
        if (ENV.contactUs.saveUrl == "") {
            resolve();
            return;
        }

        var settings = {
            crossDomain: true,
            url: ENV.contactUs.saveUrl,
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            processData: false,
            data: JSON.stringify({
                first_name: _form.elements["firstName"].value,
                last_name: _form.elements["lastName"].value,
                company: _form.elements["company"].value,
                email: _form.elements["email"].value,
                phone_number: _form.elements["phone"].value,
                message: _form.elements["message"].value
            })
        };

        $.ajax(settings)
            .done(() => {
                console.log("Saved successfully");
                resolve();
            })
            .fail(error => {
                reject(error);
            });
    };
});