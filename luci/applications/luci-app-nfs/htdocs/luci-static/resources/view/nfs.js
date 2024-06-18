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
    var m, s, o, c;
    m = new form.Map('nfs', _('NFS Manage'));

    // -- NFS Share --
    s = m.section(form.TypedSection, "share", _("Shared Directories"));
    s.anonymous = true;
    s.addremove = true;

    o = s.option(form.Flag, "enabled", _("Enable"));
    o.rmempty = false;
    o.default = "1";

    o = s.option(form.Value, "path", _("Path"));
    o.placeholder = "/mnt";
    o.rmempty = false;
    o.optional = false;

    o = s.option(form.Value, "clients", _("Clients"));
    o.placeholder = "192.168.1.0/24";
    o.rmempty = false;
    o.optional = false;

    o = s.option(form.Value, "options", _("options"));
    o.placeholder = "rw,sync,root_squash,all_squash,insecure,no_subtree_check";
    o.rmempty = false;
    o.optional = false;

    // -- NFS Mount --
    c = m.section(form.TypedSection, "mount", _("Mounted Points"));
    c.anonymous = true;
    c.addremove = true;

    o = c.option(form.Flag, "enabled", _("Enable"));
    o.default = "1";
    o.rmempty = false;

    o = c.option(form.Value, "source", _("source"));
    o.placeholder = "192.168.1.1:/mnt/*";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "target", _("target"));
    o.placeholder = "/mnt/nfs/*";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "options", _("options"));
    o.placeholder = "rw,nolock";
    o.rmempty = false;
    o.optional = false;

    o = c.option(form.Value, "delay", _("delay"));
    o.placeholder = "5";
    o.rmempty = false;
    o.optional = false;

    return m.render();
  },
});