frappe.ui.form.on('Sales Invoice', {
    property_name: function(frm, cdt, cdn) {
        frappe.model.set_value(cdt, cdn, "customer", "");
	if (frm.doc.cost_center) {
            frappe.call({
                method: "frappe.client.get_value",
                args: {
                    doctype: "Property",
                    fieldname: "status",
                    filters: {
                        name: frm.doc.cost_center
                    },
                },
                callback: function(r, rt) {
                    if (r.message) {
                        if (r.message.status == "On lease") {
                            frappe.call({
                                method: "frappe.client.get_value",
                                args: {
                                    doctype: "Lease",
                                    fieldname: "customer",
                                    filters: {
                                        property: frm.doc.cost_center
                                    },
                                },
                                callback: function(r, rt) {
                                    if (r.message) {
                                        frappe.model.set_value(cdt, cdn, "customer", r.message.customer);
                                    }
                                }
                            });
                        }
                    }
                }
            });
        } else {
            frappe.model.set_value(cdt, cdn, "customer", "");
        }
    }
})