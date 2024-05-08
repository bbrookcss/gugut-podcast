
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let div0;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let img0_class_value;
    	let t4;
    	let div1;
    	let a0;
    	let li0;
    	let t6;
    	let a1;
    	let li1;
    	let t8;
    	let a2;
    	let li2;
    	let div1_class_value;
    	let t10;
    	let section;
    	let div7;
    	let div3;
    	let h10;
    	let t12;
    	let p0;
    	let t14;
    	let button;
    	let t16;
    	let img1;
    	let img1_src_value;
    	let t17;
    	let img2;
    	let img2_src_value;
    	let t18;
    	let div5;
    	let div4;
    	let img3;
    	let img3_src_value;
    	let t19;
    	let div6;
    	let t20;
    	let div8;
    	let a3;
    	let img4;
    	let img4_src_value;
    	let t21;
    	let a4;
    	let img5;
    	let img5_src_value;
    	let t22;
    	let a5;
    	let img6;
    	let img6_src_value;
    	let t23;
    	let a6;
    	let img7;
    	let img7_src_value;
    	let t24;
    	let div11;
    	let div9;
    	let img8;
    	let img8_src_value;
    	let t25;
    	let div10;
    	let a7;
    	let img9;
    	let img9_src_value;
    	let t26;
    	let span2;
    	let t28;
    	let h11;
    	let t30;
    	let p1;
    	let t32;
    	let a8;
    	let t34;
    	let div46;
    	let div12;
    	let h12;
    	let t36;
    	let a9;
    	let p2;
    	let t38;
    	let div31;
    	let div15;
    	let img10;
    	let img10_src_value;
    	let t39;
    	let h13;
    	let t41;
    	let div14;
    	let div13;
    	let img11;
    	let img11_src_value;
    	let span3;
    	let t43;
    	let span4;
    	let t45;
    	let div18;
    	let img12;
    	let img12_src_value;
    	let t46;
    	let h14;
    	let t48;
    	let div17;
    	let div16;
    	let img13;
    	let img13_src_value;
    	let span5;
    	let t50;
    	let span6;
    	let t52;
    	let div21;
    	let img14;
    	let img14_src_value;
    	let t53;
    	let h15;
    	let t55;
    	let div20;
    	let div19;
    	let img15;
    	let img15_src_value;
    	let span7;
    	let t57;
    	let span8;
    	let t59;
    	let div24;
    	let img16;
    	let img16_src_value;
    	let t60;
    	let h16;
    	let t62;
    	let div23;
    	let div22;
    	let img17;
    	let img17_src_value;
    	let span9;
    	let t64;
    	let span10;
    	let t66;
    	let div27;
    	let img18;
    	let img18_src_value;
    	let t67;
    	let h17;
    	let t69;
    	let div26;
    	let div25;
    	let img19;
    	let img19_src_value;
    	let span11;
    	let t71;
    	let span12;
    	let t73;
    	let div30;
    	let img20;
    	let img20_src_value;
    	let t74;
    	let h18;
    	let t76;
    	let div29;
    	let div28;
    	let img21;
    	let img21_src_value;
    	let span13;
    	let t78;
    	let span14;
    	let t80;
    	let br0;
    	let br1;
    	let t81;
    	let br2;
    	let br3;
    	let t82;
    	let br4;
    	let t83;
    	let div32;
    	let h19;
    	let t85;
    	let a10;
    	let p3;
    	let t87;
    	let div45;
    	let div35;
    	let img22;
    	let img22_src_value;
    	let t88;
    	let div34;
    	let div33;
    	let p4;
    	let t90;
    	let p5;
    	let t92;
    	let p6;
    	let t94;
    	let div36;
    	let t95;
    	let div39;
    	let img23;
    	let img23_src_value;
    	let t96;
    	let div38;
    	let div37;
    	let p7;
    	let t98;
    	let p8;
    	let t100;
    	let p9;
    	let t102;
    	let div40;
    	let t103;
    	let div43;
    	let img24;
    	let img24_src_value;
    	let t104;
    	let div42;
    	let div41;
    	let p10;
    	let t106;
    	let p11;
    	let t108;
    	let p12;
    	let t110;
    	let div44;
    	let t111;
    	let br5;
    	let br6;
    	let br7;
    	let br8;
    	let br9;
    	let br10;
    	let br11;
    	let br12;
    	let t112;
    	let footer;
    	let div50;
    	let div49;
    	let div47;
    	let a11;
    	let svg0;
    	let path0;
    	let t113;
    	let a12;
    	let svg1;
    	let path1;
    	let t114;
    	let a13;
    	let svg2;
    	let path2;
    	let t115;
    	let a14;
    	let svg3;
    	let path3;
    	let t116;
    	let a15;
    	let svg4;
    	let path4;
    	let t117;
    	let div48;
    	let a16;
    	let li3;
    	let t119;
    	let a17;
    	let li4;
    	let t121;
    	let a18;
    	let li5;
    	let t123;
    	let a19;
    	let li6;
    	let t125;
    	let div51;
    	let p13;
    	let t127;
    	let p14;
    	let t128;
    	let a20;
    	let t130;
    	let style;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "gugut";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "podcast";
    			t3 = space();
    			div2 = element("div");
    			img0 = element("img");
    			t4 = space();
    			div1 = element("div");
    			a0 = element("a");
    			li0 = element("li");
    			li0.textContent = "about us";
    			t6 = space();
    			a1 = element("a");
    			li1 = element("li");
    			li1.textContent = "giveaway";
    			t8 = space();
    			a2 = element("a");
    			li2 = element("li");
    			li2.textContent = "inquiries";
    			t10 = space();
    			section = element("section");
    			div7 = element("div");
    			div3 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Thought-Provoking Conversations and Entertaining Stories";
    			t12 = space();
    			p0 = element("p");
    			p0.textContent = "Gugut is an entertainment/educational podcast focused on discussing different perspectives on philosophy and the day-to-day lives of everyday people.";
    			t14 = space();
    			button = element("button");
    			button.textContent = "Start Listening";
    			t16 = space();
    			img1 = element("img");
    			t17 = space();
    			img2 = element("img");
    			t18 = space();
    			div5 = element("div");
    			div4 = element("div");
    			img3 = element("img");
    			t19 = space();
    			div6 = element("div");
    			t20 = space();
    			div8 = element("div");
    			a3 = element("a");
    			img4 = element("img");
    			t21 = space();
    			a4 = element("a");
    			img5 = element("img");
    			t22 = space();
    			a5 = element("a");
    			img6 = element("img");
    			t23 = space();
    			a6 = element("a");
    			img7 = element("img");
    			t24 = space();
    			div11 = element("div");
    			div9 = element("div");
    			img8 = element("img");
    			t25 = space();
    			div10 = element("div");
    			a7 = element("a");
    			img9 = element("img");
    			t26 = space();
    			span2 = element("span");
    			span2.textContent = "Latest episode";
    			t28 = space();
    			h11 = element("h1");
    			h11.textContent = "በራስ ሰዐት መስራት፤ online ማስተማር እና Freelancing | ከቃልኪዳን ጋር የተደረገ ቆይታ";
    			t30 = space();
    			p1 = element("p");
    			p1.textContent = "In this episode, we chat with Kalkidan, a software developer, Udemy instructor, and remote work expert. Kalkidan's story is one of determination and hustle. She";
    			t32 = space();
    			a8 = element("a");
    			a8.textContent = "See episode";
    			t34 = space();
    			div46 = element("div");
    			div12 = element("div");
    			h12 = element("h1");
    			h12.textContent = "More episodes";
    			t36 = space();
    			a9 = element("a");
    			p2 = element("p");
    			p2.textContent = "View";
    			t38 = space();
    			div31 = element("div");
    			div15 = element("div");
    			img10 = element("img");
    			t39 = space();
    			h13 = element("h1");
    			h13.textContent = "በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ";
    			t41 = space();
    			div14 = element("div");
    			div13 = element("div");
    			img11 = element("img");
    			span3 = element("span");
    			span3.textContent = "Play this episode";
    			t43 = space();
    			span4 = element("span");
    			span4.textContent = "04 Mar /23";
    			t45 = space();
    			div18 = element("div");
    			img12 = element("img");
    			t46 = space();
    			h14 = element("h1");
    			h14.textContent = "በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ";
    			t48 = space();
    			div17 = element("div");
    			div16 = element("div");
    			img13 = element("img");
    			span5 = element("span");
    			span5.textContent = "Play this episode";
    			t50 = space();
    			span6 = element("span");
    			span6.textContent = "04 Mar /23";
    			t52 = space();
    			div21 = element("div");
    			img14 = element("img");
    			t53 = space();
    			h15 = element("h1");
    			h15.textContent = "በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ";
    			t55 = space();
    			div20 = element("div");
    			div19 = element("div");
    			img15 = element("img");
    			span7 = element("span");
    			span7.textContent = "Play this episode";
    			t57 = space();
    			span8 = element("span");
    			span8.textContent = "04 Mar /23";
    			t59 = space();
    			div24 = element("div");
    			img16 = element("img");
    			t60 = space();
    			h16 = element("h1");
    			h16.textContent = "በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ";
    			t62 = space();
    			div23 = element("div");
    			div22 = element("div");
    			img17 = element("img");
    			span9 = element("span");
    			span9.textContent = "Play this episode";
    			t64 = space();
    			span10 = element("span");
    			span10.textContent = "04 Mar /23";
    			t66 = space();
    			div27 = element("div");
    			img18 = element("img");
    			t67 = space();
    			h17 = element("h1");
    			h17.textContent = "በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ";
    			t69 = space();
    			div26 = element("div");
    			div25 = element("div");
    			img19 = element("img");
    			span11 = element("span");
    			span11.textContent = "Play this episode";
    			t71 = space();
    			span12 = element("span");
    			span12.textContent = "04 Mar /23";
    			t73 = space();
    			div30 = element("div");
    			img20 = element("img");
    			t74 = space();
    			h18 = element("h1");
    			h18.textContent = "በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ";
    			t76 = space();
    			div29 = element("div");
    			div28 = element("div");
    			img21 = element("img");
    			span13 = element("span");
    			span13.textContent = "Play this episode";
    			t78 = space();
    			span14 = element("span");
    			span14.textContent = "04 Mar /23";
    			t80 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t81 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t82 = space();
    			br4 = element("br");
    			t83 = space();
    			div32 = element("div");
    			h19 = element("h1");
    			h19.textContent = "Audio";
    			t85 = space();
    			a10 = element("a");
    			p3 = element("p");
    			p3.textContent = "View";
    			t87 = space();
    			div45 = element("div");
    			div35 = element("div");
    			img22 = element("img");
    			t88 = space();
    			div34 = element("div");
    			div33 = element("div");
    			p4 = element("p");
    			p4.textContent = "EP#140 \"ከ12 አቁሜ ስዕል ጀመርኩ\" : ሙዚቃ Tibebu";
    			t90 = space();
    			p5 = element("p");
    			p5.textContent = "February 26 2024";
    			t92 = space();
    			p6 = element("p");
    			p6.textContent = "Gugut is an entertainment/educational podcast which is focused on discussing different perspectives on technology, philosophy and day-to-day lives of everyday";
    			t94 = space();
    			div36 = element("div");
    			t95 = space();
    			div39 = element("div");
    			img23 = element("img");
    			t96 = space();
    			div38 = element("div");
    			div37 = element("div");
    			p7 = element("p");
    			p7.textContent = "EP 145 \"ከ12 አቁሜ ስዕል ጀመርኩ\" : ሙዚቃ ቪዲዮ ፕሮዲውሰር እና የፋሽን ብራንድ ዲዛይነር | Kirubel Tibebu";
    			t98 = space();
    			p8 = element("p");
    			p8.textContent = "February 26 2024";
    			t100 = space();
    			p9 = element("p");
    			p9.textContent = "Gugut is an entertainment/educational podcast which is focused on discussing different perspectives on technology, philosophy and day-to-day lives of everyday";
    			t102 = space();
    			div40 = element("div");
    			t103 = space();
    			div43 = element("div");
    			img24 = element("img");
    			t104 = space();
    			div42 = element("div");
    			div41 = element("div");
    			p10 = element("p");
    			p10.textContent = "ስዕል ጀመርኩ\" : ሙዚቃ ቪዲዮ ፕሮዲውሰር እና የፋሽን ብራንድ ዲዛይነር | Kirubel Tibebu";
    			t106 = space();
    			p11 = element("p");
    			p11.textContent = "February 26 2024";
    			t108 = space();
    			p12 = element("p");
    			p12.textContent = "Gugut is an entertainment/educational podcast which is focused on discussing different perspectives on technology, philosophy and day-to-day lives of everyday";
    			t110 = space();
    			div44 = element("div");
    			t111 = space();
    			br5 = element("br");
    			br6 = element("br");
    			br7 = element("br");
    			br8 = element("br");
    			br9 = element("br");
    			br10 = element("br");
    			br11 = element("br");
    			br12 = element("br");
    			t112 = space();
    			footer = element("footer");
    			div50 = element("div");
    			div49 = element("div");
    			div47 = element("div");
    			a11 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t113 = space();
    			a12 = element("a");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t114 = space();
    			a13 = element("a");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t115 = space();
    			a14 = element("a");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t116 = space();
    			a15 = element("a");
    			svg4 = svg_element("svg");
    			path4 = svg_element("path");
    			t117 = space();
    			div48 = element("div");
    			a16 = element("a");
    			li3 = element("li");
    			li3.textContent = "home";
    			t119 = space();
    			a17 = element("a");
    			li4 = element("li");
    			li4.textContent = "about us";
    			t121 = space();
    			a18 = element("a");
    			li5 = element("li");
    			li5.textContent = "giveaway";
    			t123 = space();
    			a19 = element("a");
    			li6 = element("li");
    			li6.textContent = "Feedback";
    			t125 = space();
    			div51 = element("div");
    			p13 = element("p");
    			p13.textContent = "© 2023 Gugut Podcast. All rights reserved.";
    			t127 = space();
    			p14 = element("p");
    			t128 = text("Website designed by ");
    			a20 = element("a");
    			a20.textContent = "Yonathan Dejene";
    			t130 = space();
    			style = element("style");
    			style.textContent = "a{\n    text-decoration: none;\n  }\n\tmain {\n\n\t}\n    header{\n        width: 100%;\n        backdrop-filter: blur(13px);\n        height: 80px;\n        padding: 0;\n        background-color: #1e1e1ec1;\n        margin: 0;\n        display: block;\n        position: fixed;\n        z-index: 99;\n        box-shadow: 0 0 10px rgba(0, 0, 3, 0.5);\n    }\n    .logo{\n        text-transform: uppercase;\n        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n        font-weight: 700;\n        padding-left: 113px;\n        margin-top: 26px;\n        font-size: 20px;\n        position: absolute; \n    }\n    .logo span{\n       left: 3%;\n       cursor: pointer;\n    }\n    .logo span:first-child{\n        color: #f39b35;\n    }\n    .logo span:last-child{\n        color: #289fed;\n\n    }\n    .detail img{\n        display: none;\n    }\n    .detail{\n        width: 100%;\n        height: 100%;\n        margin: 0 auto;\n        display: block;\n    }\n    .navigation{\n        height: 100%;\n        justify-content: center;\n        display: flex;\n        text-align: center;\n    }\n    \n   .navigation.visible {\n        display: grid;\n        transition: .5s;\n      }\n    \n      .scaled {\n        transition: .5s;\n        transform: scale(-1.3);\n      }\n    .navigation a{\n        height: 100%;\n        display: table;\n        float: left;\n        text-decoration: none;\n        padding: 0 20px;\n    }\n    .navigation a li{\n        color: rgb(207, 207, 207);\n        padding: 0 40px;\n        display: table-cell;\n        text-transform: uppercase;\n        vertical-align: middle;\n        font-weight: 600;\n        height: 100%;\n        transition: .3s;\n        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n        font-size: 15px;\n    }\n    .navigation a li:hover{\n        color: white;\n        scale: 107%;\n    }\n    .firstsection{\n        display: flex;\n        justify-content: space-between;\n        background-color: #1e1e1e;\n        height: 718px;\n        padding-right: 113px;\n        padding-left: 113px;\n        align-items: center;  \n    }\n    .firsttext{\n        position: relative;\n        z-index: 1;\n        height: 718px;\n        margin-bottom: 20px;\n    }\n    .firsttext h1{\n        width: 470px;\n        font-size: 51px;\n        margin-top: 150px; \n    }\n    .firsttext p{\n        font-size: 15px;\n        width: 540px;\n        margin-bottom: 70px;\n    }\n    .firsttext button{\n        display: flex;\n        width: 160px;\n        border: none;\n        border-radius: 20px;\n        height: 45px;\n        color: white;\n        text-align: center;\n        cursor: pointer;\n        justify-content: center;\n        align-items: center;\n        background-color: #ee7306;\n        margin-bottom: 70px;\n        transition: .2s;\n    }\n    .firsttext button:hover{\n        scale: 110%;\n        transition: .5s;\n        background-color: #0d8ce1;\n        color: black;\n        font-size: 17px;\n    }\n    .firsttext img{\n        margin: 0 10px;\n    }\n    .firsttext img:first-child{\n        width: 100px;\n    }\n    .circle {\n        display: flex;\n        justify-content: flex-end;\n        align-items: center;\n        width: 30%;\n        height: 715px;\n        position: relative;\n    }\n    .circlee {\n        width: 300px;\n        height: 300px;\n        border-radius: 50%;\n        box-shadow:  0 0 90px 50px rgb(255, 162, 0);\n        margin: auto;\n    }\n    .circle img{\n        position: relative;\n        right: 10px;\n    }\n    .secondsection{\n        align-items: center;\n        height: 280px;\n        background-color: #2d2d2d;\n        display: grid;\n        place-items: center;\n        justify-content: flex-end;\n\t    grid-template-columns: repeat(auto-fit, minmax(400px, 5fr));\n    }\n    .secondsection img{\n      width: auto; \n    }\n    .image-with-gradient {\n        position: relative;\n      }\n      \n      .image-with-gradient::after {\n        content: \"\";\n        position: absolute;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background-image: linear-gradient(to left, rgba(132, 132, 132, 0.028), rgba(0, 0, 0, 0.9));\n        opacity: .95;\n      }\n    .inside{\n        padding-left: 113px;\n        padding-right: 113px;\n        bottom: -785px;\n        position: absolute;\n    }\n    .inside h1{\n       font-size: 37px;\n       width: 40%;\n       \n    }\n    .inside p{\n        color: rgba(255, 255, 255, 0.678);\n        font-weight: 200;\n        font-size: 17px;\n        line-height: 1.7;\n        letter-spacing: 0.02em;\n        width: 32%;\n    }\n    .inside a:hover{\n        letter-spacing: 0.05em;\n    }\n    .inside a{\n        font-size: 17px;\n        text-transform: capitalize;\n        text-decoration: underline;\n        font-weight: 200;\n        color: rgba(255, 255, 255, 0.857);\n    }\n    .inside img{\n        position: absolute;\n        left: 49%;\n        top: 1px;\n    }\n    .inside img:hover{\n        scale: 105%;\n    }\n    .inside span{\n        color: #f39b35;\n        text-transform: uppercase;\n        font-size: 15px;\n        font-weight: 600;\n        text-align: start;\n    }\n    .finalsection{\n        padding-right: 113px;\n        padding-left: 113px;\n        height: auto;\n        background-color: #1e1e1e;\n    }\n    .more{\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n    }\n    .morn{\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n    }\n    .morn h1{\n        font-weight: 400;\n    }\n    .morn a{\n        color: #f39b35;\n        text-decoration: underline;\n    }\n    .more a{\n        color: #f39b35;\n        text-decoration: underline;\n    }\n    .thumbn{\n        display: grid;\n\t    grid-template-columns: repeat(auto-fit, minmax(30%, 5fr));\n\t    grid-column-gap: 15px;\n\t    grid-row-gap: 30px;\n\t    margin-top: 15px;\n    }\n    .bannerth{\n        width: 100%;\n        border-radius: 15px;\n        transition: .2s;\n    }\n    .maker{\n        display: flex;\n        align-items: stretch;\n    }\n    .maker img{\n        padding-left: 0px;\n    }\n    .yetersa{\n        font-weight: 200;\n    }\n    .maker span{\n        padding-left: 10px;\n        font-size: 17px;\n        color: #f39b35;\n        text-transform: capitalize;\n    }\n    .maker span:hover{\n        text-decoration: underline;\n    }\n    .thumbn img:hover{\n        scale: 104%;\n        color: rgba(255, 255, 255, 0.6);\n    }\n    .amistart{\n        margin-top: 16px;\n        padding-left: 8px;\n        display: flex;\n        justify-content: space-between;\n    }\n    .info{\n        align-items: flex-start;\n\t    margin-top: 7px;\n    }\n    .info h1{\n        overflow-y: hidden;\n        font-size: 18px;\n        line-height: 28px;\n        transition: .5s;\n    }\n    .info h1:hover{\n        scale: 105%;\n        text-decoration: underline;\n    }\n    .alls{\n       display: flex;\n       align-items: center;\n    }\n    .alls img{\n        width: 80px;\n        border-radius: 9999px;\n        cursor: pointer;\n    }\n    .alls img:hover{\n        scale: 105%;\n        transition: .3s;\n    }\n    .allstext{\n        flex: 1 1 0%;\n        overflow-x: auto;\n        margin-left: 32px;  \n    }\n    .ps{\n        justify-content: space-between;\n        margin: 10px 0;\n        display: flex;\n    }\n    .lasts{\n        color: rgba(255, 255, 255, 0.60);\n        font-weight: 100;\n        font-size: 18px;\n    }\n    .isover{\n        letter-spacing: 0.025em;\n        font-size: 21px;\n        color: white;\n        display: -webkit-box;\n        -webkit-box-orient: vertical;\n        -webkit-line-clamp: 2;\n        width: 50%;\n    }\n    .guro{\n        overflow: hidden;\n        font-weight: 200;\n        width: 50%;\n        font-size: 18px;\n        color: rgba(255, 255, 255, 0.60);\n        overflow: hidden;\n        display: -webkit-box;\n        -webkit-box-orient: vertical;\n        -webkit-line-clamp: 2;\n        line-height: 1.625;\n    }\n    .hr{\n        height: 1px;\n        background-color: white;\n        width: 100%;\n        margin-bottom: -24px;\n    }\n    .contact{\n        background-color: #292929;\n        color: white;\n        width: 100%;\n    }\n    .iconnav{\n        padding-top: 2.5rem; \n        padding-bottom: 2.5rem; \n        display: flex;\n        gap: 1rem; \n        align-items: center;\n        flex-direction: column;\n    }\n    .icons a{\n        color: white;\n       margin: 0 5px;\n    }\n    \n    .nav{\n        justify-content: center;\n        display: flex;\n        text-align: center;\n    }\n    \n    \n    .nav a li{\n        color: rgb(184, 184, 184);\n        padding: 0 10px;\n        display: table-cell;\n        text-transform: capitalize;\n        font-size: 15px;\n    }\n    .nav a li:hover{\n        color: rgb(225, 165, 0);\n        text-decoration: underline;\n        scale: 107%;\n    }\n    .design{\n        background-color: #242424;\n        display: flex;\n        align-items: center;\n        color: #797979;\n        flex-direction: column;\n    }\n    .design p{\n        margin: 6px 50px;\n        font-size: 14px;\n    }\n    .design a{\n        color: rgb(204, 133, 1);\n        text-decoration: underline;\n    }\n\t@media (min-width: 640px) {\n\t\tmain {\n\t\t\t\n\t\t}\n\t}\n    @media (max-width: 1024px) {\n\t\t\n        .logo{\n        padding-left: 80px;\n        margin-top: 30px;\n        font-size: 17px;\n        }\n        .navigation a li{\n            padding: 0 30px;\n            font-size: 13px;\n\t}.firstsection{\n        padding-right: 80px;\n        padding-left: 80px; \n    }.firsttext h1{\n        font-size: 37px;\n        margin-top: 150px;\n    }.firsttext p{\n        font-size: 14px;\n        width: 350px;\n        letter-spacing: 0.02em;\n    }  .circle {\n        display: flex;\n        justify-content: flex-end;\n        align-items: center;\n        width: 30%;\n        height: 715px;\n        position: relative;\n    }\n    .circlee {\n        width: 280px;\n        height: 280px;\n        border-radius: 50%;\n        box-shadow:  0 0 90px 40px rgb(255, 162, 0);\n        margin: auto;\n    }\n    .circle img{\n        position: relative;\n        width: 290px;\n        right: 2px;\n    }.gradient{ \n        width: 100%;\n        position: absolute;\n        background-image: linear-gradient(to left, rgba(255, 255, 255, 0.007), black);\n        height: 68%;\n        opacity: .9;\n    } .inside{\n        padding-left: 80px;\n        padding-right: 80px;\n        bottom: 0px;\n        margin: 40px 0px;\n        background-color: #1e1e1e;\n        position: relative;\n    }\n    .inside h1{\n        font-size: 32px;\n        width: 100%;\n     }\n     .inside p{\n         width: 100%;\n     }\n     .inside img{\n         position: absolute;\n         left: 45%;\n         top: -380px;\n     }\n     .image-with-gradient::after {\n        height: 99.5%;\n      }\n      .finalsection{\n        padding-right: 80px;\n        padding-left: 80px;\n    }\n    .maker span{\n        font-size: 12px;\n    }\n    .info h1{\n        font-size: 14px;\n    }.yetersa{\n        font-weight: 200;\n        font-size: 13px;\n    }.maker img{\n        padding-left: 0px;\n        width: 10px;\n    }\n}@media (max-width: 900px) {\n    .logo{\n        padding-left: 65px;\n        font-size: 16px;\n        }.firstsection{\n            padding-right: 65px;\n            padding-left: 65px; \n        }\n        .firsttext h1{\n            font-size: 33px;\n        }\n        .detail img{\n            display: block;\n            position: absolute;\n            width: 30px;\n            left: 88%;\n            top: 30%;\n        }\n        .navigation{\n            height: 200px;\n            justify-content: center;\n            display: none;\n            margin-left: 67%;\n            width: 230px;\n            border-radius: 8px;\n            margin-top: 90px;\n            background-color: #333333;\n            text-align: center;\n        }\n        .navigation a{\n            display: block;\n            float: none;\n            padding: 10px 0;\n            height: auto;\n            opacity: 86%;\n        }\n        .inside{\n            padding-left: 65px;\n            padding-right: 65px;\n        }\n        .finalsection{\n            padding-left: 65px;\n            padding-right: 65px;\n        }\n        .inside h1{\n            font-size: 25px;\n        }\n        .more h1{\n            font-weight: 300;\n            font-size: 27px;\n        }\n        .morn h1{\n            font-weight: 400;\n            font-size: 25px;\n        }\n        .morn a{\n            font-size: 15px;\n        }\n        .more a{\n            font-size: 15px;\n        }.thumbn{\n            grid-template-columns: repeat(auto-fit, minmax(40%, 5fr));\n        }.maker span{\n            font-size: 17px;\n        }\n        .info h1{\n        display: -webkit-box;\n        -webkit-box-orient: vertical;\n        -webkit-line-clamp: 1;\n        line-height: 1.625;\n            font-size: 18px;\n        }.yetersa{\n            font-size: 15px;\n        }.maker img{\n            width: 17px;\n        }\n        .circle {\n            display: flex;\n            justify-content: flex-end;\n            align-items: center;\n            width: 30%;\n            height: 715px;\n            position: relative;\n        }\n        .circlee {\n            width: 240px;\n            height: 240px;\n            border-radius: 50%;\n            box-shadow:  0 0 110px 30px rgb(255, 162, 0);\n            margin: auto;\n        }\n        .circle img{\n            position: relative;\n            width: 250px;\n            right: 1px;\n        }\n    }@media (max-width: 767px){\n        .firstsection{\n            height: 958px;\n            padding-right: 65px;\n            padding-left: 65px;\n            justify-content: center;\n            align-items: center;  \n        }\n        .firsttext{\n            position: absolute;\n            top: 320px;    \n            height: 718px;\n            margin-bottom: 20px;\n        }\n        .firsttext h1{\n            width: 80%;\n            font-size: 32px;\n            padding-left: 65px;\n            padding-right: 65px;\n            margin-bottom: 50px;\n        }\n        .firsttext p{\n            width: 80%;\n            padding-left: 65px;\n            padding-right: 65px;\n        }\n        .firsttext button{\n            width: 300px;\n            margin-left: 70px;\n            border-radius: 30px;\n        }\n        .firsttext img{\n            margin: 0 0px;\n            padding-left: 65px;\n        }\n        .firsttext img:first-child{\n            width: 100px;\n        }\n        .circle {\n            display: flex;\n            justify-content: start;\n            height: 15px;\n            position: absolute;\n            left: 18%;\n            bottom: 80%;\n        } .circlee {\n             \n        }\n    }@media (max-width: 640px) {\n        .logo{\n            padding-left: 32px;\n        }\n        .firsttext h1{\n            width: 87%;\n            font-size: 30px;\n            padding-left: 32px;\n            padding-right: 0;\n        }\n        .firsttext p{\n            width: 90%;\n            padding-left: 32px;\n            padding-right: 0;\n        }.firsttext button{\n            width: 90%;\n            margin-left: 32px;\n            margin-right: 32px;\n            border-radius: 30px;\n        }.firsttext img{\n            margin: 0 0px;\n            padding-left: 35px;\n        }.secondsection{\n            height: 550px;\n            padding-top: 30px;\n            padding-bottom: 30px;\n            grid-template-columns: repeat(auto-fit, minmax(400px, 4fr));\n        }.inside{\n            padding-left: 35px;\n            padding-right: 35px;\n        }\n        .finalsection{\n            padding-left: 35px;\n            padding-right: 35px;\n        }.inside img{\n            position: absolute;\n            left: 45%;\n            width: 65px;\n            top: -250px;\n        }.thumbn{\n            grid-template-columns: repeat(auto-fit, minmax(50%, 5fr));\n        }.maker span{\n            font-size: 13px;\n        }\n        .yetersa{\n            font-size: 13px;\n        }.maker img{\n            width: 10px;\n        }.ps{\n            justify-content: center;\n            margin: 10px 0;\n            display: grid;\n        }.lasts{\n            color: rgba(255, 255, 255, 0.60);\n            font-weight: 100;\n            font-size: 18px;\n            margin: 0 0;\n        }.isover{\n            letter-spacing: 0.025em;\n            font-size: 19px;\n            width: 100%;\n        }.allstext{\n            margin-left: 22px;  \n        }.guro{\n            overflow: hidden;\n            font-weight: 200;\n            width: 100%;\n            font-size: 18px;\n            color: rgba(255, 255, 255, 0.60);\n            overflow: hidden;\n            display: -webkit-box;\n            -webkit-box-orient: vertical;\n            -webkit-line-clamp: 2;\n            line-height: 1.625;\n        }\n        .navigation{\n            position: relative;\n            right: 80px;\n            width: 200px;\n        }\n        .hr{\n            height: 1px;\n            background-color: white;\n            width: 100%;\n            margin-bottom: -24px;\n        }\n    }";
    			add_location(span0, file, 16, 12, 298);
    			add_location(span1, file, 17, 12, 329);
    			attr_dev(div0, "class", "logo");
    			add_location(div0, file, 15, 8, 267);
    			if (!src_url_equal(img0.src, img0_src_value = "nav.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", img0_class_value = /*imageScaled*/ ctx[1] ? 'scaled' : '');
    			add_location(img0, file, 20, 12, 406);
    			add_location(li0, file, 22, 25, 598);
    			attr_dev(a0, "href", "");
    			add_location(a0, file, 22, 14, 587);
    			add_location(li1, file, 23, 25, 645);
    			attr_dev(a1, "href", "");
    			add_location(a1, file, 23, 14, 634);
    			add_location(li2, file, 24, 25, 692);
    			attr_dev(a2, "href", "");
    			add_location(a2, file, 24, 14, 681);
    			attr_dev(div1, "class", div1_class_value = "navigation " + (/*navigationVisible*/ ctx[0] ? 'visible' : ''));
    			add_location(div1, file, 21, 12, 511);
    			attr_dev(div2, "class", "detail");
    			add_location(div2, file, 19, 8, 373);
    			add_location(header, file, 14, 4, 250);
    			add_location(h10, file, 31, 16, 866);
    			add_location(p0, file, 32, 16, 948);
    			add_location(button, file, 33, 16, 1121);
    			if (!src_url_equal(img1.src, img1_src_value = "anchor-hero.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "anchor");
    			add_location(img1, file, 34, 16, 1170);
    			if (!src_url_equal(img2.src, img2_src_value = "yt-hero.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "anchor");
    			add_location(img2, file, 35, 16, 1227);
    			attr_dev(div3, "class", "firsttext");
    			add_location(div3, file, 30, 12, 826);
    			if (!src_url_equal(img3.src, img3_src_value = "logo.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "logo");
    			add_location(img3, file, 39, 20, 1374);
    			attr_dev(div4, "class", "circlee");
    			add_location(div4, file, 38, 16, 1332);
    			attr_dev(div5, "class", "circle");
    			add_location(div5, file, 37, 12, 1295);
    			add_location(div6, file, 42, 12, 1461);
    			attr_dev(div7, "class", "firstsection");
    			add_location(div7, file, 29, 8, 787);
    			add_location(section, file, 28, 4, 769);
    			if (!src_url_equal(img4.src, img4_src_value = "spotify.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "");
    			add_location(img4, file, 46, 19, 1554);
    			attr_dev(a3, "href", "");
    			add_location(a3, file, 46, 8, 1543);
    			if (!src_url_equal(img5.src, img5_src_value = "google-podcast.svg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "");
    			add_location(img5, file, 47, 19, 1608);
    			attr_dev(a4, "href", "");
    			add_location(a4, file, 47, 8, 1597);
    			if (!src_url_equal(img6.src, img6_src_value = "apple-podcast.svg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "");
    			add_location(img6, file, 48, 19, 1669);
    			attr_dev(a5, "href", "");
    			add_location(a5, file, 48, 8, 1658);
    			if (!src_url_equal(img7.src, img7_src_value = "teraki.svg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "");
    			add_location(img7, file, 49, 19, 1729);
    			attr_dev(a6, "href", "");
    			add_location(a6, file, 49, 8, 1718);
    			attr_dev(div8, "class", "secondsection");
    			add_location(div8, file, 45, 4, 1507);
    			if (!src_url_equal(img8.src, img8_src_value = "fin.jpeg")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "thumb");
    			attr_dev(img8, "width", "100%");
    			add_location(img8, file, 55, 12, 1873);
    			attr_dev(div9, "class", "image-with-gradient");
    			add_location(div9, file, 54, 8, 1827);
    			if (!src_url_equal(img9.src, img9_src_value = "play.svg")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "");
    			add_location(img9, file, 58, 19, 1980);
    			attr_dev(a7, "href", "");
    			add_location(a7, file, 58, 8, 1969);
    			add_location(span2, file, 59, 8, 2020);
    			add_location(h11, file, 60, 8, 2056);
    			add_location(p1, file, 61, 8, 2137);
    			attr_dev(a8, "href", "");
    			add_location(a8, file, 62, 8, 2313);
    			attr_dev(div10, "class", "inside");
    			add_location(div10, file, 57, 4, 1940);
    			attr_dev(div11, "class", "fosection");
    			add_location(div11, file, 51, 4, 1778);
    			add_location(h12, file, 67, 12, 2429);
    			add_location(p2, file, 68, 23, 2475);
    			attr_dev(a9, "href", "");
    			add_location(a9, file, 68, 12, 2464);
    			attr_dev(div12, "class", "more");
    			add_location(div12, file, 66, 8, 2398);
    			attr_dev(img10, "class", "bannerth");
    			if (!src_url_equal(img10.src, img10_src_value = "maxresdefault.jpg")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "");
    			add_location(img10, file, 72, 16, 2582);
    			add_location(h13, file, 73, 16, 2652);
    			if (!src_url_equal(img11.src, img11_src_value = "episode-play.svg")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "episode-paly");
    			attr_dev(img11, "width", "16px");
    			add_location(img11, file, 75, 39, 2774);
    			add_location(span3, file, 75, 99, 2834);
    			attr_dev(div13, "class", "maker");
    			add_location(div13, file, 75, 20, 2755);
    			attr_dev(span4, "class", "yetersa");
    			set_style(span4, "color", "rgba(255, 255, 255, 0.6)");
    			add_location(span4, file, 76, 20, 2891);
    			attr_dev(div14, "class", "amistart");
    			add_location(div14, file, 74, 16, 2712);
    			attr_dev(div15, "class", "info");
    			add_location(div15, file, 71, 12, 2547);
    			attr_dev(img12, "class", "bannerth");
    			if (!src_url_equal(img12.src, img12_src_value = "th1.jpeg")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "");
    			add_location(img12, file, 81, 16, 3061);
    			add_location(h14, file, 82, 16, 3122);
    			if (!src_url_equal(img13.src, img13_src_value = "episode-play.svg")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "episode-paly");
    			attr_dev(img13, "width", "16px");
    			add_location(img13, file, 84, 39, 3244);
    			add_location(span5, file, 84, 99, 3304);
    			attr_dev(div16, "class", "maker");
    			add_location(div16, file, 84, 20, 3225);
    			attr_dev(span6, "class", "yetersa");
    			set_style(span6, "color", "rgba(255, 255, 255, 0.6)");
    			add_location(span6, file, 85, 20, 3361);
    			attr_dev(div17, "class", "amistart");
    			add_location(div17, file, 83, 16, 3182);
    			attr_dev(div18, "class", "info");
    			add_location(div18, file, 80, 12, 3026);
    			attr_dev(img14, "class", "bannerth");
    			if (!src_url_equal(img14.src, img14_src_value = "th2.jpeg")) attr_dev(img14, "src", img14_src_value);
    			attr_dev(img14, "alt", "");
    			add_location(img14, file, 89, 16, 3530);
    			add_location(h15, file, 90, 16, 3591);
    			if (!src_url_equal(img15.src, img15_src_value = "episode-play.svg")) attr_dev(img15, "src", img15_src_value);
    			attr_dev(img15, "alt", "episode-paly");
    			attr_dev(img15, "width", "16px");
    			add_location(img15, file, 92, 39, 3713);
    			add_location(span7, file, 92, 99, 3773);
    			attr_dev(div19, "class", "maker");
    			add_location(div19, file, 92, 20, 3694);
    			attr_dev(span8, "class", "yetersa");
    			set_style(span8, "color", "rgba(255, 255, 255, 0.6)");
    			add_location(span8, file, 93, 20, 3830);
    			attr_dev(div20, "class", "amistart");
    			add_location(div20, file, 91, 16, 3651);
    			attr_dev(div21, "class", "info");
    			add_location(div21, file, 88, 12, 3495);
    			attr_dev(img16, "class", "bannerth");
    			if (!src_url_equal(img16.src, img16_src_value = "th3.jpeg")) attr_dev(img16, "src", img16_src_value);
    			attr_dev(img16, "alt", "");
    			add_location(img16, file, 97, 16, 3999);
    			add_location(h16, file, 98, 16, 4060);
    			if (!src_url_equal(img17.src, img17_src_value = "episode-play.svg")) attr_dev(img17, "src", img17_src_value);
    			attr_dev(img17, "alt", "episode-paly");
    			attr_dev(img17, "width", "16px");
    			add_location(img17, file, 100, 39, 4182);
    			add_location(span9, file, 100, 99, 4242);
    			attr_dev(div22, "class", "maker");
    			add_location(div22, file, 100, 20, 4163);
    			attr_dev(span10, "class", "yetersa");
    			set_style(span10, "color", "rgba(255, 255, 255, 0.6)");
    			add_location(span10, file, 101, 20, 4299);
    			attr_dev(div23, "class", "amistart");
    			add_location(div23, file, 99, 16, 4120);
    			attr_dev(div24, "class", "info");
    			add_location(div24, file, 96, 12, 3964);
    			attr_dev(img18, "class", "bannerth");
    			if (!src_url_equal(img18.src, img18_src_value = "th4.jpeg")) attr_dev(img18, "src", img18_src_value);
    			attr_dev(img18, "alt", "");
    			add_location(img18, file, 105, 16, 4468);
    			add_location(h17, file, 106, 16, 4529);
    			if (!src_url_equal(img19.src, img19_src_value = "episode-play.svg")) attr_dev(img19, "src", img19_src_value);
    			attr_dev(img19, "alt", "episode-paly");
    			attr_dev(img19, "width", "16px");
    			add_location(img19, file, 108, 39, 4651);
    			add_location(span11, file, 108, 99, 4711);
    			attr_dev(div25, "class", "maker");
    			add_location(div25, file, 108, 20, 4632);
    			attr_dev(span12, "class", "yetersa");
    			set_style(span12, "color", "rgba(255, 255, 255, 0.6)");
    			add_location(span12, file, 109, 20, 4768);
    			attr_dev(div26, "class", "amistart");
    			add_location(div26, file, 107, 16, 4589);
    			attr_dev(div27, "class", "info");
    			add_location(div27, file, 104, 12, 4433);
    			attr_dev(img20, "class", "bannerth");
    			if (!src_url_equal(img20.src, img20_src_value = "th5.jpeg")) attr_dev(img20, "src", img20_src_value);
    			attr_dev(img20, "alt", "");
    			add_location(img20, file, 113, 16, 4937);
    			add_location(h18, file, 114, 16, 4998);
    			if (!src_url_equal(img21.src, img21_src_value = "episode-play.svg")) attr_dev(img21, "src", img21_src_value);
    			attr_dev(img21, "alt", "episode-paly");
    			attr_dev(img21, "width", "16px");
    			add_location(img21, file, 116, 39, 5120);
    			add_location(span13, file, 116, 99, 5180);
    			attr_dev(div28, "class", "maker");
    			add_location(div28, file, 116, 20, 5101);
    			attr_dev(span14, "class", "yetersa");
    			set_style(span14, "color", "rgba(255, 255, 255, 0.6)");
    			add_location(span14, file, 117, 20, 5237);
    			attr_dev(div29, "class", "amistart");
    			add_location(div29, file, 115, 16, 5058);
    			attr_dev(div30, "class", "info");
    			add_location(div30, file, 112, 12, 4902);
    			attr_dev(div31, "class", "thumbn");
    			add_location(div31, file, 70, 8, 2514);
    			add_location(br0, file, 121, 8, 5382);
    			add_location(br1, file, 121, 12, 5386);
    			add_location(br2, file, 121, 17, 5391);
    			add_location(br3, file, 121, 21, 5395);
    			add_location(br4, file, 121, 26, 5400);
    			add_location(h19, file, 123, 12, 5444);
    			add_location(p3, file, 124, 23, 5482);
    			attr_dev(a10, "href", "");
    			add_location(a10, file, 124, 12, 5471);
    			attr_dev(div32, "class", "morn");
    			add_location(div32, file, 122, 8, 5413);
    			if (!src_url_equal(img22.src, img22_src_value = "play.svg")) attr_dev(img22, "src", img22_src_value);
    			attr_dev(img22, "alt", "play icon");
    			add_location(img22, file, 128, 16, 5588);
    			attr_dev(p4, "class", "isover");
    			add_location(p4, file, 131, 24, 5725);
    			attr_dev(p5, "class", "lasts");
    			add_location(p5, file, 132, 24, 5810);
    			attr_dev(div33, "class", "ps");
    			add_location(div33, file, 130, 20, 5684);
    			attr_dev(p6, "class", "guro");
    			add_location(p6, file, 134, 20, 5895);
    			attr_dev(div34, "class", "allstext");
    			add_location(div34, file, 129, 16, 5641);
    			attr_dev(div35, "class", "alls");
    			add_location(div35, file, 127, 12, 5553);
    			attr_dev(div36, "class", "hr");
    			add_location(div36, file, 137, 12, 6128);
    			if (!src_url_equal(img23.src, img23_src_value = "play.svg")) attr_dev(img23, "src", img23_src_value);
    			attr_dev(img23, "alt", "play icon");
    			add_location(img23, file, 139, 16, 6198);
    			attr_dev(p7, "class", "isover");
    			add_location(p7, file, 142, 24, 6335);
    			attr_dev(p8, "class", "lasts");
    			add_location(p8, file, 143, 24, 6460);
    			attr_dev(div37, "class", "ps");
    			add_location(div37, file, 141, 20, 6294);
    			attr_dev(p9, "class", "guro");
    			add_location(p9, file, 145, 20, 6545);
    			attr_dev(div38, "class", "allstext");
    			add_location(div38, file, 140, 16, 6251);
    			attr_dev(div39, "class", "alls");
    			add_location(div39, file, 138, 12, 6163);
    			attr_dev(div40, "class", "hr");
    			add_location(div40, file, 148, 12, 6778);
    			if (!src_url_equal(img24.src, img24_src_value = "play.svg")) attr_dev(img24, "src", img24_src_value);
    			attr_dev(img24, "alt", "play icon");
    			add_location(img24, file, 150, 16, 6848);
    			attr_dev(p10, "class", "isover");
    			add_location(p10, file, 153, 24, 6985);
    			attr_dev(p11, "class", "lasts");
    			add_location(p11, file, 154, 24, 7094);
    			attr_dev(div41, "class", "ps");
    			add_location(div41, file, 152, 20, 6944);
    			attr_dev(p12, "class", "guro");
    			add_location(p12, file, 156, 20, 7179);
    			attr_dev(div42, "class", "allstext");
    			add_location(div42, file, 151, 16, 6901);
    			attr_dev(div43, "class", "alls");
    			add_location(div43, file, 149, 12, 6813);
    			attr_dev(div44, "class", "hr");
    			add_location(div44, file, 159, 12, 7412);
    			add_location(br5, file, 160, 12, 7447);
    			add_location(br6, file, 160, 16, 7451);
    			add_location(br7, file, 160, 20, 7455);
    			add_location(br8, file, 160, 24, 7459);
    			add_location(br9, file, 160, 28, 7463);
    			add_location(br10, file, 160, 32, 7467);
    			add_location(br11, file, 160, 36, 7471);
    			add_location(br12, file, 160, 40, 7475);
    			attr_dev(div45, "class", "audio");
    			add_location(div45, file, 126, 8, 5521);
    			attr_dev(div46, "class", "finalsection");
    			add_location(div46, file, 65, 4, 2363);
    			attr_dev(path0, "d", "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951");
    			add_location(path0, file, 168, 210, 7842);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "20");
    			attr_dev(svg0, "height", "20");
    			attr_dev(svg0, "fill", "currentColor");
    			attr_dev(svg0, "viewBox", "0 0 16 16");
    			attr_dev(svg0, "class", "fill-current");
    			add_location(svg0, file, 168, 86, 7718);
    			attr_dev(a11, "href", "https://www.facebook.com/profile.php?id=100094580416767");
    			add_location(a11, file, 168, 20, 7652);
    			attr_dev(path1, "d", "M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z");
    			add_location(path1, file, 169, 181, 8339);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "width", "20");
    			attr_dev(svg1, "height", "20");
    			attr_dev(svg1, "fill", "currentColor");
    			attr_dev(svg1, "viewBox", "0 0 16 16");
    			attr_dev(svg1, "class", "fill-current");
    			add_location(svg1, file, 169, 57, 8215);
    			attr_dev(a12, "href", "https://x.com/gugutpodcast");
    			add_location(a12, file, 169, 20, 8178);
    			attr_dev(path2, "d", "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334");
    			add_location(path2, file, 170, 189, 8722);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "width", "20");
    			attr_dev(svg2, "height", "20");
    			attr_dev(svg2, "fill", "currentColor");
    			attr_dev(svg2, "viewBox", "0 0 16 16");
    			attr_dev(svg2, "class", "fill-current");
    			add_location(svg2, file, 170, 65, 8598);
    			attr_dev(a13, "href", "https://instagram.com/gugutpodcast");
    			add_location(a13, file, 170, 20, 8553);
    			attr_dev(path3, "d", "M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z");
    			add_location(path3, file, 171, 190, 10443);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "width", "20");
    			attr_dev(svg3, "height", "20");
    			attr_dev(svg3, "fill", "currentColor");
    			attr_dev(svg3, "viewBox", "0 0 16 16");
    			attr_dev(svg3, "class", "fill-current");
    			add_location(svg3, file, 171, 66, 10319);
    			attr_dev(a14, "href", "https://youtube.com/c/@gugutpodcast");
    			add_location(a14, file, 171, 20, 10273);
    			attr_dev(path4, "d", "M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z");
    			add_location(path4, file, 172, 186, 11425);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "width", "20");
    			attr_dev(svg4, "height", "20");
    			attr_dev(svg4, "fill", "currentColor");
    			attr_dev(svg4, "viewBox", "0 0 16 16");
    			attr_dev(svg4, "class", "fill-current");
    			add_location(svg4, file, 172, 62, 11301);
    			attr_dev(a15, "href", "https://tiktok.com/gugutpodcast");
    			add_location(a15, file, 172, 20, 11259);
    			attr_dev(div47, "class", "icons");
    			add_location(div47, file, 167, 16, 7612);
    			add_location(li3, file, 175, 31, 11671);
    			attr_dev(a16, "href", "");
    			add_location(a16, file, 175, 20, 11660);
    			add_location(li4, file, 176, 31, 11720);
    			attr_dev(a17, "href", "");
    			add_location(a17, file, 176, 20, 11709);
    			add_location(li5, file, 177, 31, 11773);
    			attr_dev(a18, "href", "");
    			add_location(a18, file, 177, 20, 11762);
    			add_location(li6, file, 178, 31, 11826);
    			attr_dev(a19, "href", "");
    			add_location(a19, file, 178, 20, 11815);
    			attr_dev(div48, "class", "nav");
    			add_location(div48, file, 174, 16, 11622);
    			attr_dev(div49, "class", "iconnav");
    			add_location(div49, file, 166, 12, 7574);
    			attr_dev(div50, "class", "contact");
    			add_location(div50, file, 165, 8, 7540);
    			add_location(p13, file, 184, 12, 11955);
    			attr_dev(a20, "href", "");
    			add_location(a20, file, 185, 35, 12040);
    			add_location(p14, file, 185, 12, 12017);
    			attr_dev(div51, "class", "design");
    			add_location(div51, file, 183, 8, 11922);
    			add_location(footer, file, 164, 4, 7523);
    			add_location(style, file, 188, 4, 12108);
    			add_location(main, file, 13, 0, 239);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(header, t3);
    			append_dev(header, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(a0, li0);
    			append_dev(div1, t6);
    			append_dev(div1, a1);
    			append_dev(a1, li1);
    			append_dev(div1, t8);
    			append_dev(div1, a2);
    			append_dev(a2, li2);
    			append_dev(main, t10);
    			append_dev(main, section);
    			append_dev(section, div7);
    			append_dev(div7, div3);
    			append_dev(div3, h10);
    			append_dev(div3, t12);
    			append_dev(div3, p0);
    			append_dev(div3, t14);
    			append_dev(div3, button);
    			append_dev(div3, t16);
    			append_dev(div3, img1);
    			append_dev(div3, t17);
    			append_dev(div3, img2);
    			append_dev(div7, t18);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div4, img3);
    			append_dev(div7, t19);
    			append_dev(div7, div6);
    			append_dev(main, t20);
    			append_dev(main, div8);
    			append_dev(div8, a3);
    			append_dev(a3, img4);
    			append_dev(div8, t21);
    			append_dev(div8, a4);
    			append_dev(a4, img5);
    			append_dev(div8, t22);
    			append_dev(div8, a5);
    			append_dev(a5, img6);
    			append_dev(div8, t23);
    			append_dev(div8, a6);
    			append_dev(a6, img7);
    			append_dev(main, t24);
    			append_dev(main, div11);
    			append_dev(div11, div9);
    			append_dev(div9, img8);
    			append_dev(div11, t25);
    			append_dev(div11, div10);
    			append_dev(div10, a7);
    			append_dev(a7, img9);
    			append_dev(div10, t26);
    			append_dev(div10, span2);
    			append_dev(div10, t28);
    			append_dev(div10, h11);
    			append_dev(div10, t30);
    			append_dev(div10, p1);
    			append_dev(div10, t32);
    			append_dev(div10, a8);
    			append_dev(main, t34);
    			append_dev(main, div46);
    			append_dev(div46, div12);
    			append_dev(div12, h12);
    			append_dev(div12, t36);
    			append_dev(div12, a9);
    			append_dev(a9, p2);
    			append_dev(div46, t38);
    			append_dev(div46, div31);
    			append_dev(div31, div15);
    			append_dev(div15, img10);
    			append_dev(div15, t39);
    			append_dev(div15, h13);
    			append_dev(div15, t41);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, img11);
    			append_dev(div13, span3);
    			append_dev(div14, t43);
    			append_dev(div14, span4);
    			append_dev(div31, t45);
    			append_dev(div31, div18);
    			append_dev(div18, img12);
    			append_dev(div18, t46);
    			append_dev(div18, h14);
    			append_dev(div18, t48);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, img13);
    			append_dev(div16, span5);
    			append_dev(div17, t50);
    			append_dev(div17, span6);
    			append_dev(div31, t52);
    			append_dev(div31, div21);
    			append_dev(div21, img14);
    			append_dev(div21, t53);
    			append_dev(div21, h15);
    			append_dev(div21, t55);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(div19, img15);
    			append_dev(div19, span7);
    			append_dev(div20, t57);
    			append_dev(div20, span8);
    			append_dev(div31, t59);
    			append_dev(div31, div24);
    			append_dev(div24, img16);
    			append_dev(div24, t60);
    			append_dev(div24, h16);
    			append_dev(div24, t62);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, img17);
    			append_dev(div22, span9);
    			append_dev(div23, t64);
    			append_dev(div23, span10);
    			append_dev(div31, t66);
    			append_dev(div31, div27);
    			append_dev(div27, img18);
    			append_dev(div27, t67);
    			append_dev(div27, h17);
    			append_dev(div27, t69);
    			append_dev(div27, div26);
    			append_dev(div26, div25);
    			append_dev(div25, img19);
    			append_dev(div25, span11);
    			append_dev(div26, t71);
    			append_dev(div26, span12);
    			append_dev(div31, t73);
    			append_dev(div31, div30);
    			append_dev(div30, img20);
    			append_dev(div30, t74);
    			append_dev(div30, h18);
    			append_dev(div30, t76);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, img21);
    			append_dev(div28, span13);
    			append_dev(div29, t78);
    			append_dev(div29, span14);
    			append_dev(div46, t80);
    			append_dev(div46, br0);
    			append_dev(div46, br1);
    			append_dev(div46, t81);
    			append_dev(div46, br2);
    			append_dev(div46, br3);
    			append_dev(div46, t82);
    			append_dev(div46, br4);
    			append_dev(div46, t83);
    			append_dev(div46, div32);
    			append_dev(div32, h19);
    			append_dev(div32, t85);
    			append_dev(div32, a10);
    			append_dev(a10, p3);
    			append_dev(div46, t87);
    			append_dev(div46, div45);
    			append_dev(div45, div35);
    			append_dev(div35, img22);
    			append_dev(div35, t88);
    			append_dev(div35, div34);
    			append_dev(div34, div33);
    			append_dev(div33, p4);
    			append_dev(div33, t90);
    			append_dev(div33, p5);
    			append_dev(div34, t92);
    			append_dev(div34, p6);
    			append_dev(div45, t94);
    			append_dev(div45, div36);
    			append_dev(div45, t95);
    			append_dev(div45, div39);
    			append_dev(div39, img23);
    			append_dev(div39, t96);
    			append_dev(div39, div38);
    			append_dev(div38, div37);
    			append_dev(div37, p7);
    			append_dev(div37, t98);
    			append_dev(div37, p8);
    			append_dev(div38, t100);
    			append_dev(div38, p9);
    			append_dev(div45, t102);
    			append_dev(div45, div40);
    			append_dev(div45, t103);
    			append_dev(div45, div43);
    			append_dev(div43, img24);
    			append_dev(div43, t104);
    			append_dev(div43, div42);
    			append_dev(div42, div41);
    			append_dev(div41, p10);
    			append_dev(div41, t106);
    			append_dev(div41, p11);
    			append_dev(div42, t108);
    			append_dev(div42, p12);
    			append_dev(div45, t110);
    			append_dev(div45, div44);
    			append_dev(div45, t111);
    			append_dev(div45, br5);
    			append_dev(div45, br6);
    			append_dev(div45, br7);
    			append_dev(div45, br8);
    			append_dev(div45, br9);
    			append_dev(div45, br10);
    			append_dev(div45, br11);
    			append_dev(div45, br12);
    			append_dev(main, t112);
    			append_dev(main, footer);
    			append_dev(footer, div50);
    			append_dev(div50, div49);
    			append_dev(div49, div47);
    			append_dev(div47, a11);
    			append_dev(a11, svg0);
    			append_dev(svg0, path0);
    			append_dev(div47, t113);
    			append_dev(div47, a12);
    			append_dev(a12, svg1);
    			append_dev(svg1, path1);
    			append_dev(div47, t114);
    			append_dev(div47, a13);
    			append_dev(a13, svg2);
    			append_dev(svg2, path2);
    			append_dev(div47, t115);
    			append_dev(div47, a14);
    			append_dev(a14, svg3);
    			append_dev(svg3, path3);
    			append_dev(div47, t116);
    			append_dev(div47, a15);
    			append_dev(a15, svg4);
    			append_dev(svg4, path4);
    			append_dev(div49, t117);
    			append_dev(div49, div48);
    			append_dev(div48, a16);
    			append_dev(a16, li3);
    			append_dev(div48, t119);
    			append_dev(div48, a17);
    			append_dev(a17, li4);
    			append_dev(div48, t121);
    			append_dev(div48, a18);
    			append_dev(a18, li5);
    			append_dev(div48, t123);
    			append_dev(div48, a19);
    			append_dev(a19, li6);
    			append_dev(footer, t125);
    			append_dev(footer, div51);
    			append_dev(div51, p13);
    			append_dev(div51, t127);
    			append_dev(div51, p14);
    			append_dev(p14, t128);
    			append_dev(p14, a20);
    			append_dev(main, t130);
    			append_dev(main, style);

    			if (!mounted) {
    				dispose = listen_dev(img0, "click", /*toggleImageScale*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageScaled*/ 2 && img0_class_value !== (img0_class_value = /*imageScaled*/ ctx[1] ? 'scaled' : '')) {
    				attr_dev(img0, "class", img0_class_value);
    			}

    			if (dirty & /*navigationVisible*/ 1 && div1_class_value !== (div1_class_value = "navigation " + (/*navigationVisible*/ ctx[0] ? 'visible' : ''))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let navigationVisible = false;
    	let imageScaled = false;

    	function toggleImageScale() {
    		$$invalidate(1, imageScaled = !imageScaled);
    		$$invalidate(0, navigationVisible = !navigationVisible);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		noop,
    		navigationVisible,
    		imageScaled,
    		toggleImageScale
    	});

    	$$self.$inject_state = $$props => {
    		if ('navigationVisible' in $$props) $$invalidate(0, navigationVisible = $$props.navigationVisible);
    		if ('imageScaled' in $$props) $$invalidate(1, imageScaled = $$props.imageScaled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [navigationVisible, imageScaled, toggleImageScale];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
