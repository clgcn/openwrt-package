'use strict';
'require form';
'require poll';
'require rpc';
'require uci';
'require view';
'require fs';

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(fs.stat('/etc/config/fstab'), null),
			L.resolveDefault(fs.stat('/etc/config/nfs'), {}),
		]);
	},
  render: function(data) {
    var m, s, o;
    m = new form.Map('nfs', _('NFS Manage'));

    // -- NFS Share --
    s = m.section(form.TypedSection, "share", translate("Shared Directories"));
    s.anonymous = true;
    s.addremove = true;

    o = s.option(form.Flag, "enabled", translate("Enable"));
    o.rmempty = false;
    o.default = "1";

    o = s.option(form.Value, "path", translate("Path"));
    o.placeholder = "/mnt";
    o.rmempty = false;
    o.optional = false;

    o = s.option(form.Value, "clients", translate("Clients"));
    o.placeholder = "192.168.1.0/24";
    o.rmempty = false;
    o.optional = false;

    o = s.option(form.Value, "options", translate("options"));
    o.placeholder = "rw,sync,root_squash,all_squash,insecure,no_subtree_check";
    o.rmempty = false;
    o.optional = false;

    // -- NFS Mount --
    c = m.section(form.TypedSection, "mount", translate("Mounted Points"));
    c.anonymous = true;
    c.addremove = true;

    o = c.option(form.Flag, "enabled", translate("Enable"));
    o.default = "1";
    o.rmempty = false;

    o = c.option(form.Value, "source", translate("source"));
    o.placeholder = "192.168.1.1:/mnt/*";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "target", translate("target"));
    o.placeholder = "/mnt/nfs/*";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "options", translate("options"));
    o.placeholder = "rw,nolock";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "delay", translate("delay"));
    o.placeholder = "5";
    o.rmempty = false;
    o.optional = false;

    return m.render();
  },
});