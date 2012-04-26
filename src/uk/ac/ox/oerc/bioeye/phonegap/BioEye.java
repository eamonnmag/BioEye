package uk.ac.ox.oerc.bioeye.phonegap;

import android.graphics.Color;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.view.WindowManager;
import android.widget.RelativeLayout;
import com.phonegap.DroidGap;

public class BioEye extends DroidGap {

    protected boolean _active = true;
    protected int _splashTime = 5000; // time to display the splash screen in ms

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.splash);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            _active = false;
            super.init();
            super.loadUrl("file:///android_asset/www/index.html");

            setContentView(R.layout.main);
            RelativeLayout view = (RelativeLayout) findViewById(R.id.phonegap_container);

            View html = (View) appView.getParent();
            html.setBackgroundColor(Color.TRANSPARENT);
            view.addView(html, new LayoutParams(LayoutParams.FILL_PARENT,
                    LayoutParams.FILL_PARENT));

            appView.setBackgroundColor(Color.TRANSPARENT);

            // Avoid the focus on click events
            appView.setFocusable(false);
        }
        return true;
    }
}